# Task 1.3: Identity Vault - Load Project Entries

## Overview

This document describes the unit tests for Task 1.3, which implements the functionality to load project entries from the API and dynamically render them in the Identity Vault page.

## Implementation Summary

**File Modified**: `front-end/identity_vault.html`

**Key Changes**:
1. Updated the Projects section header to include an `id="projects-header"` attribute
2. Changed initial count from "🚀 PROJECTS (5)" to "🚀 PROJECTS (0)"
3. Added `id="projects-body"` to the project entries container
4. Removed hardcoded project entry HTML
5. Added `loadProjectEntries()` JavaScript function
6. Function is called on page load (alongside `loadEducationEntries()` and `loadExperienceEntries()`)

**Functionality**:
- Fetches project entries from `GET /api/projects` endpoint
- Dynamically renders each entry with formatted dates, description, technologies, bullets, achievements, and URL
- Updates the header count dynamically
- Shows placeholder message when no entries exist
- Handles API errors gracefully

## API Endpoint

**Endpoint**: `GET http://localhost:5000/api/projects`

**Response Format**:
```json
{
  "status": "success",
  "projects": [
    {
      "_id": "string",
      "userId": "string",
      "name": "string",
      "description": "string | null",
      "startDate": "ISO date string",
      "endDate": "ISO date string | null",
      "bullets": ["string"],
      "technologies": ["string"],
      "skills": ["ObjectId"],
      "url": "string | null",
      "achievements": ["string"],
      "tags": ["string"]
    }
  ]
}
```

## Test Cases

### Test 1: API Response - Success with Multiple Entries

**Objective**: Verify that multiple project entries are correctly loaded and rendered.

**Setup**:
1. Ensure backend is running on `http://localhost:5000`
2. Ensure database has at least 2 project entries for `DEMO_USER_ID`

**Steps**:
1. Open `identity_vault.html` in browser
2. Wait for page to load
3. Open browser DevTools Console

**Expected Results**:
- ✅ No console errors
- ✅ Header shows `🚀 PROJECTS (N)` where N matches the number of entries in database
- ✅ Each entry is displayed in a `.vault-entry` div
- ✅ Each entry contains:
  - Project name (bold, larger font)
  - Date range (formatted as "MMM YYYY - MMM YYYY" or "MMM YYYY - Present")
  - Description (if present)
  - Technologies list (if present)
  - Bullets list (if present)
  - Achievements section (if present)
  - Project URL link (if present)
  - Action buttons (Edit, Delete, Copy)
- ✅ Each entry has `data-id` and `data-type="project"` attributes

**Manual Test Command**:
```bash
# First, verify API response
curl http://localhost:5000/api/projects

# Then check page in browser
open front-end/identity_vault.html
```

---

### Test 2: API Response - Empty Array

**Objective**: Verify that empty state is displayed when no project entries exist.

**Setup**:
1. Ensure backend is running
2. Ensure database has NO project entries for `DEMO_USER_ID`
   - Or temporarily delete all project entries

**Steps**:
1. Open `identity_vault.html` in browser
2. Wait for page to load

**Expected Results**:
- ✅ Header shows `🚀 PROJECTS (0)`
- ✅ `#projects-body` contains placeholder message: "No project entries yet. Click "+ Add Project" to add one."
- ✅ No `.vault-entry` divs are present
- ✅ No console errors

**Manual Test Command**:
```bash
# Verify API returns empty array
curl http://localhost:5000/api/projects

# Should return: {"status":"success","projects":[]}
```

---

### Test 3: API Response - Entry with All Fields

**Objective**: Verify that an entry with all optional fields (description, technologies, bullets, achievements, URL) is rendered correctly.

**Setup**:
1. Create a test project entry via API:

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "OneProfile",
    "description": "AI-powered career assistant platform",
    "startDate": "2024-09-01",
    "endDate": "2024-12-31",
    "technologies": ["React", "Node.js", "MongoDB", "Google Gemini API"],
    "bullets": [
      "Built full-stack application with React frontend and Express backend",
      "Integrated Google Gemini API for AI-powered content generation",
      "Implemented MongoDB for data persistence"
    ],
    "achievements": [
      "Won Best Use of Gemini API at UofTHacks 2026",
      "Featured on hackathon showcase"
    ],
    "url": "https://github.com/user/oneprofile"
  }'
```

**Steps**:
1. Open `identity_vault.html` in browser
2. Wait for page to load

**Expected Results**:
- ✅ Entry displays project name: "OneProfile"
- ✅ Date range shows: "Sep 2024 - Dec 2024"
- ✅ Description is displayed
- ✅ Technologies show as: "Technologies: React, Node.js, MongoDB, Google Gemini API"
- ✅ Bullets list is displayed with bullet points
- ✅ Achievements section shows "Achievements:" header with list
- ✅ URL shows as clickable link: "View Project →" (opens in new tab)
- ✅ All action buttons are present

---

### Test 4: API Response - Entry with Null End Date (Ongoing Project)

**Objective**: Verify that entries with `endDate: null` display "Present" correctly.

**Setup**:
1. Create a test project entry with `endDate: null`:

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Personal Portfolio",
    "description": "My personal website and portfolio",
    "startDate": "2024-01-01",
    "endDate": null,
    "technologies": ["Next.js", "TypeScript", "Tailwind CSS"]
  }'
```

**Steps**:
1. Open `identity_vault.html` in browser
2. Wait for page to load

**Expected Results**:
- ✅ Date range shows: "Jan 2024 - Present"
- ✅ No errors related to date formatting

---

### Test 5: API Response - Entry with Missing Optional Fields

**Objective**: Verify that entries without optional fields still render correctly.

**Setup**:
1. Create a minimal project entry:

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Simple Calculator",
    "startDate": "2023-06-01",
    "endDate": "2023-08-01"
  }'
```

**Steps**:
1. Open `identity_vault.html` in browser
2. Wait for page to load

**Expected Results**:
- ✅ Entry displays correctly
- ✅ Project name is shown
- ✅ Date range is shown
- ✅ No "undefined" or "null" text appears
- ✅ Description section is not shown if description is empty
- ✅ Technologies section is not shown if technologies array is empty
- ✅ Bullets list is not shown if bullets array is empty
- ✅ Achievements section is not shown if achievements array is empty
- ✅ URL link is not shown if url is empty

---

### Test 6: Technologies Display - Multiple Technologies

**Objective**: Verify that technologies are displayed correctly as a comma-separated list.

**Setup**:
1. Create a project entry with multiple technologies:

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "E-Commerce Platform",
    "startDate": "2024-01-01",
    "endDate": "2024-06-01",
    "technologies": ["React", "Redux", "Node.js", "Express", "MongoDB", "Stripe API"]
  }'
```

**Steps**:
1. Open `identity_vault.html` in browser
2. Check rendered output

**Expected Results**:
- ✅ Technologies show as: "Technologies: React, Redux, Node.js, Express, MongoDB, Stripe API"
- ✅ Technologies are joined with ", " (comma and space)
- ✅ "Technologies:" label is bold (`<strong>`)

---

### Test 7: URL Display and Link Functionality

**Objective**: Verify that project URLs are displayed correctly and are clickable.

**Setup**:
1. Create a project entry with a URL:

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My GitHub Project",
    "startDate": "2024-01-01",
    "endDate": "2024-03-01",
    "url": "https://github.com/username/project"
  }'
```

**Steps**:
1. Open `identity_vault.html` in browser
2. Check rendered output
3. Click on the URL link

**Expected Results**:
- ✅ URL shows as: "View Project →"
- ✅ Link is styled with blue color (#0066cc)
- ✅ Link has underline decoration
- ✅ Link opens in new tab (target="_blank")
- ✅ Link href is correct

---

### Test 8: Bullets and Achievements Display

**Objective**: Verify that bullets and achievements are displayed correctly as lists.

**Steps**:
1. Create a project entry with bullets and achievements
2. Check rendered output

**Expected Results**:
- ✅ Bullets are displayed as an unordered list (`<ul>`)
- ✅ Each bullet is a list item (`<li>`)
- ✅ Achievements section has a bold "Achievements:" header
- ✅ Achievements are displayed as an unordered list
- ✅ Both lists use proper indentation (padding-left: 20px)

---

### Test 9: API Error Handling - Network Error

**Objective**: Verify that network errors are handled gracefully.

**Setup**:
1. Stop the backend server
2. Open `identity_vault.html` in browser

**Steps**:
1. Open browser DevTools Console
2. Wait for page to load
3. Check console for error messages

**Expected Results**:
- ✅ Console shows error message: "Error loading project entries: ..."
- ✅ Error placeholder is displayed: "Error loading project entries. Please try again later."
- ✅ Header shows `🚀 PROJECTS (0)`
- ✅ Page does not crash

---

### Test 10: Date Formatting - Various Date Formats

**Objective**: Verify that dates are formatted correctly in different scenarios.

**Test Cases**:
- Start date: January 2024 → Should show "Jan 2024"
- End date: December 2024 → Should show "Dec 2024"
- Start date: September 2023 → Should show "Sep 2023"
- End date: null → Should show "Present"

**Steps**:
1. Create entries with various date formats
2. Check rendered output

**Expected Results**:
- ✅ All dates display in "MMM YYYY" format
- ✅ "Present" displays correctly for null end dates
- ✅ Date range separator " - " is consistent

---

### Test 11: Concurrent Loading with Other Entries

**Objective**: Verify that all entry types (education, experience, projects) load correctly when page loads.

**Steps**:
1. Ensure database has entries for all three types
2. Open `identity_vault.html` in browser
3. Check all three sections

**Expected Results**:
- ✅ All three functions are called: `loadEducationEntries()`, `loadExperienceEntries()`, `loadProjectEntries()`
- ✅ All three sections display their entries correctly
- ✅ All headers show correct counts
- ✅ No conflicts or errors
- ✅ Page loads efficiently (all API calls are independent)

---

### Test 12: DOM Element Existence Check

**Objective**: Verify that function gracefully handles missing DOM elements.

**Setup**:
1. Open `identity_vault.html` in browser
2. Use DevTools to remove `#projects-body` or `#projects-header` elements

**Steps**:
1. Call `loadProjectEntries()` manually from console
2. Check console for errors

**Expected Results**:
- ✅ Function checks for DOM element existence
- ✅ Console shows: "Required DOM elements not found for projects"
- ✅ No JavaScript errors thrown

---

## Browser Compatibility Tests

### Supported Browsers

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)

**Note**: Uses `fetch()` API, which is supported in all modern browsers.

---

## Code Quality Checks

### JavaScript Code

- ✅ Uses `async/await` for asynchronous operations
- ✅ Proper error handling with try/catch
- ✅ DOM manipulation is safe (checks for element existence)
- ✅ Function names are descriptive
- ✅ Comments are clear and helpful
- ✅ HTML string building is properly escaped (using template literals safely)

### HTML Structure

- ✅ IDs are properly set: `projects-header`, `projects-body`
- ✅ Container structure supports dynamic rendering
- ✅ No hardcoded entries remain

---

## Integration Test

### End-to-End Test Flow

1. **Backend Running**: Start backend server on port 5000
2. **Database Setup**: Ensure MongoDB has project entries
3. **Page Load**: Open `identity_vault.html` in browser
4. **Verify Display**: Check that all entries are displayed correctly
5. **Verify Count**: Check that header count matches database count
6. **Test Empty State**: Delete all entries, reload page, verify placeholder
7. **Test Error State**: Stop backend, reload page, verify error message
8. **Test Concurrent Loading**: Verify all three entry types (education, experience, projects) load together

---

## Performance Considerations

- ✅ API call is made once on page load
- ✅ No unnecessary re-renders
- ✅ DOM manipulation is efficient (uses `innerHTML` for bulk updates)
- ✅ Function can be called multiple times without issues (clears content first)
- ✅ All loading functions (`loadEducationEntries()`, `loadExperienceEntries()`, `loadProjectEntries()`) are called in parallel (independent async operations)

---

## Manual Testing Checklist

Use this checklist when manually testing Task 1.3:

- [ ] Backend server is running on port 5000
- [ ] Database is connected and has test data
- [ ] `identity_vault.html` opens without errors
- [ ] Project entries are displayed correctly
- [ ] Header count matches number of entries (shows "🚀 PROJECTS (N)")
- [ ] Empty state message shows when no entries exist
- [ ] Error message shows when API fails
- [ ] Date formatting is correct
- [ ] Description displays correctly (when present)
- [ ] Technologies display correctly (when present)
- [ ] Bullets list displays correctly (when present)
- [ ] Achievements section displays correctly (when present)
- [ ] URL link displays correctly and is clickable (when present)
- [ ] Action buttons are present on each entry
- [ ] `data-id` and `data-type="project"` attributes are set correctly
- [ ] Console shows no JavaScript errors
- [ ] All three sections (education, experience, projects) load correctly together

---

## Notes

- The function uses `fetch()` API, which requires CORS to be enabled on the backend (already configured)
- Date formatting uses `toLocaleDateString()` with English locale
- Empty state placeholder is styled with inline CSS for consistency
- Error handling displays user-friendly messages
- Technologies are displayed as a comma-separated list with a bold "Technologies:" label
- URL is displayed as a clickable link with "View Project →" text
- Achievements section has a bold "Achievements:" header to distinguish from bullets
- The function is called alongside `loadEducationEntries()` and `loadExperienceEntries()` on page load

---

**Last Updated**: 2025-01-XX  
**Task Status**: ✅ Implemented  
**Test Status**: ⏳ Pending Manual Testing
