# Task 1.2: Identity Vault - Load Experience Entries

## Overview

This document describes the unit tests for Task 1.2, which implements the functionality to load experience entries from the API and dynamically render them in the Identity Vault page.

## Implementation Summary

**File Modified**: `front-end/identity_vault.html`

**Key Changes**:
1. Updated the Experiences section header to include an `id="experiences-header"` attribute
2. Changed header text from "💼 JOBS (3)" to "💼 EXPERIENCES (0)" for consistency
3. Changed button text from "+ Add Job" to "+ Add Experience"
4. Added `id="experiences-body"` to the experience entries container
5. Removed hardcoded experience entry HTML
6. Added `loadExperienceEntries()` JavaScript function
7. Function is called on page load (alongside `loadEducationEntries()`)

**Functionality**:
- Fetches experience entries from `GET /api/experience` endpoint
- Dynamically renders each entry with formatted dates, employment type, company, location, description, bullets, and achievements
- Updates the header count dynamically
- Shows placeholder message when no entries exist
- Handles API errors gracefully

## API Endpoint

**Endpoint**: `GET http://localhost:5000/api/experience`

**Response Format**:
```json
{
  "status": "success",
  "experiences": [
    {
      "_id": "string",
      "userId": "string",
      "title": "string",
      "company": "string | null",
      "location": "string | null",
      "employmentType": "full-time" | "part-time" | "contract" | "internship" | "freelance",
      "startDate": "ISO date string",
      "endDate": "ISO date string | null",
      "bullets": ["string"],
      "skills": ["ObjectId"],
      "description": "string | null",
      "achievements": ["string"],
      "tags": ["string"]
    }
  ]
}
```

## Test Cases

### Test 1: API Response - Success with Multiple Entries

**Objective**: Verify that multiple experience entries are correctly loaded and rendered.

**Setup**:
1. Ensure backend is running on `http://localhost:5000`
2. Ensure database has at least 2 experience entries for `DEMO_USER_ID`

**Steps**:
1. Open `identity_vault.html` in browser
2. Wait for page to load
3. Open browser DevTools Console

**Expected Results**:
- ✅ No console errors
- ✅ Header shows `💼 EXPERIENCES (N)` where N matches the number of entries in database
- ✅ Each entry is displayed in a `.vault-entry` div
- ✅ Each entry contains:
  - Job title (bold, larger font)
  - Company name and location (if present)
  - Date range (formatted as "MMM YYYY - MMM YYYY" or "MMM YYYY - Present")
  - Employment type (Full-time, Part-time, Contract, Internship, or Freelance)
  - Description (if present)
  - Bullets list (if present)
  - Achievements list (if present)
  - Action buttons (Edit, Delete, Copy)
- ✅ Each entry has `data-id` and `data-type="experience"` attributes

**Manual Test Command**:
```bash
# First, verify API response
curl http://localhost:5000/api/experience

# Then check page in browser
open front-end/identity_vault.html
```

---

### Test 2: API Response - Empty Array

**Objective**: Verify that empty state is displayed when no experience entries exist.

**Setup**:
1. Ensure backend is running
2. Ensure database has NO experience entries for `DEMO_USER_ID`
   - Or temporarily delete all experience entries

**Steps**:
1. Open `identity_vault.html` in browser
2. Wait for page to load

**Expected Results**:
- ✅ Header shows `💼 EXPERIENCES (0)`
- ✅ `#experiences-body` contains placeholder message: "No experience entries yet. Click "+ Add Experience" to add one."
- ✅ No `.vault-entry` divs are present
- ✅ No console errors

**Manual Test Command**:
```bash
# Verify API returns empty array
curl http://localhost:5000/api/experience

# Should return: {"status":"success","experiences":[]}
```

---

### Test 3: API Response - Entry with All Fields

**Objective**: Verify that an entry with all optional fields (company, location, description, bullets, achievements) is rendered correctly.

**Setup**:
1. Create a test experience entry via API:

```bash
curl -X POST http://localhost:5000/api/experience \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Software Engineering Intern",
    "company": "Tech Corp Solutions",
    "location": "San Francisco, CA",
    "employmentType": "internship",
    "startDate": "2024-06-01",
    "endDate": "2024-08-31",
    "description": "Worked on building scalable web applications using React and Node.js",
    "bullets": [
      "Developed RESTful APIs handling 10,000+ requests per day",
      "Improved application performance by 30% through code optimization",
      "Collaborated with cross-functional teams in agile environment"
    ],
    "achievements": [
      "Won quarterly innovation award",
      "Led team of 3 junior developers"
    ]
  }'
```

**Steps**:
1. Open `identity_vault.html` in browser
2. Wait for page to load

**Expected Results**:
- ✅ Entry displays job title: "Software Engineering Intern"
- ✅ Company and location show: "Tech Corp Solutions • San Francisco, CA"
- ✅ Date range shows: "Jun 2024 - Aug 2024"
- ✅ Employment type shows: "Internship"
- ✅ Description is displayed
- ✅ Bullets list is displayed with bullet points
- ✅ Achievements section shows "Achievements:" header with list
- ✅ All action buttons are present

---

### Test 4: API Response - Entry with Null End Date (Current Position)

**Objective**: Verify that entries with `endDate: null` display "Present" correctly.

**Setup**:
1. Create a test experience entry with `endDate: null`:

```bash
curl -X POST http://localhost:5000/api/experience \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Software Engineer",
    "company": "Tech Corp Solutions",
    "location": "San Francisco, CA",
    "employmentType": "full-time",
    "startDate": "2023-01-01",
    "endDate": null
  }'
```

**Steps**:
1. Open `identity_vault.html` in browser
2. Wait for page to load

**Expected Results**:
- ✅ Date range shows: "Jan 2023 - Present"
- ✅ No errors related to date formatting

---

### Test 5: API Response - Entry with Missing Optional Fields

**Objective**: Verify that entries without optional fields (company, location, description, bullets, achievements) still render correctly.

**Setup**:
1. Create a minimal experience entry:

```bash
curl -X POST http://localhost:5000/api/experience \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Freelance Developer",
    "employmentType": "freelance",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31"
  }'
```

**Steps**:
1. Open `identity_vault.html` in browser
2. Wait for page to load

**Expected Results**:
- ✅ Entry displays correctly
- ✅ Job title is shown
- ✅ Date range and employment type are shown
- ✅ No "undefined" or "null" text appears
- ✅ Company/location line is not shown if both are missing
- ✅ Description section is not shown if description is empty
- ✅ Bullets list is not shown if bullets array is empty
- ✅ Achievements section is not shown if achievements array is empty

---

### Test 6: Employment Type Display - All Types

**Objective**: Verify that all employment types are displayed correctly.

**Setup**:
1. Create entries with each employment type:
   - `"employmentType": "full-time"`
   - `"employmentType": "part-time"`
   - `"employmentType": "contract"`
   - `"employmentType": "internship"`
   - `"employmentType": "freelance"`

**Steps**:
1. Open `identity_vault.html` in browser
2. Check each entry

**Expected Results**:
- ✅ "full-time" displays as "Full-time"
- ✅ "part-time" displays as "Part-time"
- ✅ "contract" displays as "Contract"
- ✅ "internship" displays as "Internship"
- ✅ "freelance" displays as "Freelance"

---

### Test 7: Company and Location Display

**Objective**: Verify that company and location are displayed correctly in various combinations.

**Test Cases**:
- Company only → Should show "Company Name"
- Location only → Should show "Location Name"
- Both → Should show "Company Name • Location Name"
- Neither → Should not show company/location line

**Steps**:
1. Create entries with different combinations
2. Check rendered output

**Expected Results**:
- ✅ Company and location are joined with " • " separator
- ✅ Line is hidden when both are missing

---

### Test 8: Bullets and Achievements Display

**Objective**: Verify that bullets and achievements are displayed correctly as lists.

**Steps**:
1. Create an entry with bullets and achievements
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
- ✅ Console shows error message: "Error loading experience entries: ..."
- ✅ Error placeholder is displayed: "Error loading experience entries. Please try again later."
- ✅ Header shows `💼 EXPERIENCES (0)`
- ✅ Page does not crash

---

### Test 10: Date Formatting - Various Date Formats

**Objective**: Verify that dates are formatted correctly in different scenarios.

**Test Cases**:
- Start date: January 2023 → Should show "Jan 2023"
- End date: December 2024 → Should show "Dec 2024"
- Start date: September 2022 → Should show "Sep 2022"
- End date: null → Should show "Present"

**Steps**:
1. Create entries with various date formats
2. Check rendered output

**Expected Results**:
- ✅ All dates display in "MMM YYYY" format
- ✅ "Present" displays correctly for null end dates
- ✅ Date range separator " - " is consistent

---

### Test 11: Concurrent Loading with Education Entries

**Objective**: Verify that both education and experience entries load correctly when page loads.

**Steps**:
1. Ensure database has both education and experience entries
2. Open `identity_vault.html` in browser
3. Check both sections

**Expected Results**:
- ✅ Both `loadEducationEntries()` and `loadExperienceEntries()` are called
- ✅ Both sections display their entries correctly
- ✅ Both headers show correct counts
- ✅ No conflicts or errors

---

### Test 12: DOM Element Existence Check

**Objective**: Verify that function gracefully handles missing DOM elements.

**Setup**:
1. Open `identity_vault.html` in browser
2. Use DevTools to remove `#experiences-body` or `#experiences-header` elements

**Steps**:
1. Call `loadExperienceEntries()` manually from console
2. Check console for errors

**Expected Results**:
- ✅ Function checks for DOM element existence
- ✅ Console shows: "Required DOM elements not found for experiences"
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
- ✅ Employment type mapping is clear and maintainable

### HTML Structure

- ✅ IDs are properly set: `experiences-header`, `experiences-body`
- ✅ Container structure supports dynamic rendering
- ✅ No hardcoded entries remain
- ✅ Header text is consistent ("EXPERIENCES" instead of "JOBS")

---

## Integration Test

### End-to-End Test Flow

1. **Backend Running**: Start backend server on port 5000
2. **Database Setup**: Ensure MongoDB has experience entries
3. **Page Load**: Open `identity_vault.html` in browser
4. **Verify Display**: Check that all entries are displayed correctly
5. **Verify Count**: Check that header count matches database count
6. **Test Empty State**: Delete all entries, reload page, verify placeholder
7. **Test Error State**: Stop backend, reload page, verify error message
8. **Test Concurrent Loading**: Verify both education and experience entries load together

---

## Performance Considerations

- ✅ API call is made once on page load
- ✅ No unnecessary re-renders
- ✅ DOM manipulation is efficient (uses `innerHTML` for bulk updates)
- ✅ Function can be called multiple times without issues (clears content first)
- ✅ Both `loadEducationEntries()` and `loadExperienceEntries()` are called in parallel (independent async operations)

---

## Manual Testing Checklist

Use this checklist when manually testing Task 1.2:

- [ ] Backend server is running on port 5000
- [ ] Database is connected and has test data
- [ ] `identity_vault.html` opens without errors
- [ ] Experience entries are displayed correctly
- [ ] Header count matches number of entries (shows "💼 EXPERIENCES (N)")
- [ ] Header text is "EXPERIENCES" (not "JOBS")
- [ ] Button text is "+ Add Experience" (not "+ Add Job")
- [ ] Empty state message shows when no entries exist
- [ ] Error message shows when API fails
- [ ] Date formatting is correct
- [ ] Employment type displays correctly (Full-time, Part-time, etc.)
- [ ] Company and location display correctly (with " • " separator)
- [ ] Description displays correctly (when present)
- [ ] Bullets list displays correctly (when present)
- [ ] Achievements section displays correctly (when present)
- [ ] Action buttons are present on each entry
- [ ] `data-id` and `data-type="experience"` attributes are set correctly
- [ ] Console shows no JavaScript errors
- [ ] Both education and experience sections load correctly together

---

## Notes

- The function uses `fetch()` API, which requires CORS to be enabled on the backend (already configured)
- Date formatting uses `toLocaleDateString()` with English locale
- Empty state placeholder is styled with inline CSS for consistency
- Error handling displays user-friendly messages
- Employment type is mapped to a human-readable format (e.g., "full-time" → "Full-time")
- Company and location are joined with " • " when both are present
- Achievements section has a header label "Achievements:" to distinguish from bullets
- The function is called alongside `loadEducationEntries()` on page load

---

**Last Updated**: 2025-01-XX  
**Task Status**: ✅ Implemented  
**Test Status**: ⏳ Pending Manual Testing
