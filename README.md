# OneProfile

**Update once. Sync everywhere.**

OneProfile is an AI-powered career assistant that helps job seekers manage and synchronize their professional identity across LinkedIn, resumes, and interviews. Built at **UofTHacks 13**.

---

## 🎯 Overview

OneProfile solves the problem of managing professional information across multiple platforms. Instead of manually updating LinkedIn, rewriting resume bullets, and preparing interview stories for each new achievement, users can **describe their progress once** in natural language. The system then:

- **Stores** progress as atomic, reusable components in the Identity Vault
- **Generates** platform-specific content using AI
- **Customizes** resumes for different job applications
- **Prepares** personalized interview questions based on your profile

---

## ✨ Key Features

### 1. **Social Media Assistant** 📱
Report your work or education progress in natural language. The AI will:
- Analyze your progress updates
- Extract and store atomic information (education, experience, projects, skills, awards)
- Generate LinkedIn update suggestions for 4 categories:
  - **Education** updates
  - **Position/Experience** updates
  - **Skills** additions/strengthening
  - **Public Post** content with hashtags

### 2. **Smart Resume Builder** 📄
Generate customized resumes tailored to specific job applications:
- Input: Company, position, and job requirements
- AI retrieves relevant entries from your Identity Vault
- AI polishes and formats content into professional resume structure:
  - **Header**: Name, contact info, links, brief summary
  - **Education**: Degree name + GPA, date range, 3 bullet points
  - **Experience**: Up to 3 experiences with title, dates, 3 bullet points each
  - **Skills**: 3-4 bullet points grouping related skills
- Output: One-page, job-tailored resume ready for download

### 3. **Interview Prep** 💼
AI-powered interview simulator:
- Input: Job description (company, position, requirements)
- AI generates personalized questions based on:
  - Job requirements
  - Your profile from Identity Vault
  - Interview type (technical, behavioral, mixed)
- Real-time conversation with AI interviewer
- Final feedback includes:
  - Overall score (0-5 scale)
  - Strengths identified
  - Areas for improvement
  - Specific recommendations

### 4. **Identity Vault** 🗄️
Centralized repository for all atomic professional information:
- **Education**: Degrees with institution, GPA, dates, achievements
- **Experiences**: Jobs with company, dates, bullet points, skills
- **Projects**: Projects with technologies, descriptions, URLs
- **Skills**: Skills with category, proficiency, experience years
- **Awards**: Awards with issuer, date, category
- All entries are atomic, reusable, and can be recombined for different purposes

### 5. **Dashboard** 📊
Overview page showing:
- Quick stats from Identity Vault (counts by type)
- Recent activity timeline
- Quick actions to access all features

### 6. **Profile Management** 👤
Manage personal information:
- Name, location, phone, email
- Links (LinkedIn, GitHub, personal website, etc.)
- Professional summary

### 7. **Account Settings** ⚙️
Privacy and preference settings:
- Privacy settings (profile visibility, email/phone display)
- Connected platforms (LinkedIn, GitHub, Twitter)
- Preferences (language, theme, notifications)
- Account management (change password, delete account)

---

## 🏗️ Architecture

### Tech Stack

- **Frontend**: HTML, CSS, JavaScript (vanilla, no framework)
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **AI Service**: Google Gemini API (to be integrated)
- **Architecture**: RESTful API design

### Project Structure

```
SkillProfile-UofTHacks13/
├── front-end/              # HTML/CSS/JS frontend
│   ├── dashboard.html
│   ├── social_media_assistant.html
│   ├── smart_resume_builder.html
│   ├── interview_prep.html
│   ├── identity_vault.html
│   ├── profile.html
│   ├── account_settings.html
│   └── script.js
├── back-end/               # Express.js backend
│   ├── src/
│   │   └── index.js        # API server
│   └── models/             # Mongoose models
│       ├── User.js
│       ├── EducationEntry.js
│       ├── ExperienceEntry.js
│       ├── ProjectEntry.js
│       ├── SkillEntry.js
│       ├── AwardEntry.js
│       └── ProgressUpdate.js
└── docs/                   # Documentation
    ├── identity-vault-schema.md
    ├── linkedin-suggestions-schema.md
    ├── resume-generation-schema.md
    ├── interview-schema.md
    ├── api-endpoints.md
    └── architecture.md
```

---

## 📊 Current Status

### ✅ Completed

1. **Frontend UI**
   - All 7 pages fully designed and styled
   - Responsive layout with monospace aesthetic
   - Navigation and user interactions implemented
   - Dashboard stats display ready for API integration

2. **Database Models**
   - 7 Mongoose models implemented:
     - User, EducationEntry, ExperienceEntry, ProjectEntry, SkillEntry, AwardEntry, ProgressUpdate
   - Complete schema definitions with validation
   - All relationships defined

3. **Backend API**
   - Complete CRUD operations for all entity types:
     - `/api/user/profile` (GET, PUT)
     - `/api/education` (GET, POST, PUT, DELETE)
     - `/api/experience` (GET, POST, PUT, DELETE)
     - `/api/projects` (GET, POST, PUT, DELETE)
     - `/api/skills` (GET, POST, PUT, DELETE)
     - `/api/awards` (GET, POST, PUT, DELETE)
   - `/api/vault/stats` endpoint for statistics
   - Unified error handling and response format
   - Input validation for required fields

4. **Documentation**
   - Complete data schema documentation
   - API endpoints documentation
   - Architecture documentation
   - AI integration schemas (ready for implementation)

### 🚧 In Progress / To Do

1. **AI Integration** (Next Priority)
   - Google Gemini API integration
   - Prompt engineering for:
     - Progress update entity extraction and polishing
     - LinkedIn suggestions generation
     - Resume content generation and formatting
     - Interview question generation and feedback
   - AI processing workflows

2. **Frontend Data Loading**
   - Connect Identity Vault to API for dynamic data display
   - Load real statistics from API in Dashboard
   - Implement CRUD operations in Identity Vault UI

3. **Resume Generation UI**
   - Connect form inputs to resume generation API
   - Display generated resume with formatting
   - Download/export functionality

4. **Interview Prep Integration**
   - Connect chat interface to interview API
   - Real-time message handling
   - Display feedback and scoring

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key (for AI features - currently not required to run basic features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SkillProfile-UofTHacks13
   ```

2. **Install backend dependencies**
   ```bash
   cd back-end
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `back-end` directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key  # Optional for now
   NODE_ENV=development
   ```

   To get a MongoDB connection string:
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free cluster
   - Get your connection string from "Connect" → "Connect your application"

4. **Start the backend server**
   ```bash
   cd back-end
   node src/index.js
   ```
   
   The server will start on `http://localhost:5000`

5. **Open the frontend**
   
   You can open the HTML files directly in your browser, or use a simple HTTP server:
   ```bash
   cd front-end
   # Using Python
   python3 -m http.server 8000
   
   # Or using Node.js http-server
   npx http-server -p 8000
   ```
   
   Then open `http://localhost:8000/dashboard.html` in your browser

### Running the Application

1. **Backend**: Must be running on port 5000
   ```bash
   cd back-end
   node src/index.js
   ```

2. **Frontend**: Open `front-end/dashboard.html` in browser or serve via HTTP server

3. **Test the API**: The Dashboard should automatically load statistics from `/api/vault/stats`

---

## 📡 API Endpoints

### Identity Vault

- `GET /api/vault/stats` - Get statistics (degrees, experiences, projects, skills, awards counts)
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/education` - Get all education entries
- `POST /api/education` - Create education entry
- `PUT /api/education/:id` - Update education entry
- `DELETE /api/education/:id` - Delete education entry

(Same pattern for `/api/experience`, `/api/projects`, `/api/skills`, `/api/awards`)

### Response Format

**Success:**
```json
{
  "status": "success",
  "data": { ... }
}
```

**Error:**
```json
{
  "status": "error",
  "message": "Error description",
  "errors": [ ... ]  // Optional validation errors
}
```

See `docs/api-endpoints.md` for complete API documentation.

---

## 🗂️ Data Models

The Identity Vault stores 6 types of atomic entries:

1. **User** - Personal information and links
2. **EducationEntry** - Degrees with institution, GPA, dates
3. **ExperienceEntry** - Jobs with company, dates, bullet points
4. **ProjectEntry** - Projects with technologies, descriptions, URLs
5. **SkillEntry** - Skills with category, proficiency, experience years
6. **AwardEntry** - Awards with issuer, date, category

All entries are atomic and can be recombined for different purposes (resumes, LinkedIn, interviews).

See `docs/identity-vault-schema.md` for detailed schema documentation.

---

## 🧪 Testing

Currently, the application uses a hardcoded `DEMO_USER_ID` for single-user mode. To test:

1. Start the backend server
2. Open the frontend Dashboard
3. Check the browser console for API calls
4. Use browser DevTools Network tab to inspect API responses

**Test API directly:**
```bash
# Get vault statistics
curl http://localhost:5000/api/vault/stats

# Get all education entries
curl http://localhost:5000/api/education

# Create a new education entry
curl -X POST http://localhost:5000/api/education \
  -H "Content-Type: application/json" \
  -d '{
    "institution": "University of Toronto",
    "degree": "Bachelor of Science",
    "fieldOfStudy": "Computer Science",
    "startDate": "2022-09-01",
    "gpa": 3.9
  }'
```

---

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- `identity-vault-schema.md` - Complete data model definitions
- `linkedin-suggestions-schema.md` - LinkedIn output formats
- `resume-generation-schema.md` - Resume generation data structures
- `interview-schema.md` - Interview simulator data structures
- `api-endpoints.md` - Complete API reference
- `architecture.md` - System architecture and design decisions

---

## 🔮 Future Enhancements

- **AI Integration**: Complete Gemini API integration with prompt engineering
- **Real-time Updates**: WebSocket support for live interview sessions
- **Export Features**: PDF/Word resume export, LinkedIn import/export
- **Analytics**: Track profile strength, suggestions acceptance rate
- **Multi-platform**: Extend beyond LinkedIn (Twitter, GitHub, portfolio)
- **Templates**: Resume and profile templates
- **Collaboration**: Share profile with mentors/coaches

---

## 🛠️ Development

### Project Status

- **Frontend**: ✅ Complete UI
- **Backend API**: ✅ Complete CRUD operations
- **Database**: ✅ All models implemented
- **AI Integration**: 🚧 To be implemented
- **Frontend-Backend Integration**: 🚧 Partial (Stats API connected)

### Next Steps

1. Implement Gemini API integration
2. Complete frontend data loading from API
3. Implement resume generation workflow
4. Complete interview prep integration
5. Add error handling and loading states in frontend

---

## 📝 License

Built for UofTHacks 13. See repository for license details.

---

## 👥 Team

Built at **UofTHacks 13**.

---

**Note**: This is an active development project. Some features are fully functional while others are in progress. Check the "Current Status" section above for implementation details.
