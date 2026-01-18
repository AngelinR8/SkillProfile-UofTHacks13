# IdentityMaster

**Update once. Sync everywhere.**

IdentityMaster is an AI-powered career assistant that helps job seekers manage and synchronize their professional identity across LinkedIn, resumes, and interviews. Built at **UofTHacks 13**.

---

## 🎯 Overview

IdentityMaster solves the problem of managing professional information across multiple platforms. Instead of manually updating LinkedIn, rewriting resume bullets, and preparing interview stories for each new achievement, users can **describe their progress once** in natural language. The system then:

- **Stores** progress as atomic, reusable components in the Identity Vault
- **Generates** platform-specific content using AI (Google Gemini API)
- **Customizes** resumes for different job applications
- **Prepares** personalized interview questions based on your profile

---

## ✨ Key Features

### 1. **Social Media Assistant** 📱
Report your work or education progress in natural language. The AI will:
- Analyze your progress updates using Google Gemini API
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
- Output: One-page, job-tailored resume ready for review

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
  - Detailed breakdown (technical, communication, problem-solving, cultural fit)

### 4. **Identity Vault** 🗄️
Centralized repository for all atomic professional information:
- **Education**: Degrees with institution, GPA, dates, achievements
- **Experiences**: Jobs with company, dates, bullet points, skills
- **Projects**: Projects with technologies, descriptions, URLs
- **Skills**: Skills with category, proficiency, experience years
- **Awards**: Awards with issuer, date, category
- Full CRUD operations (Create, Read, Update, Delete)
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
- Vault overview with statistics

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
- **AI Service**: Google Gemini API (gemini-2.5-flash model)
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
│   │   ├── index.js        # API server
│   │   ├── aiService.js    # Gemini API integration
│   │   └── aiPrompts.js    # AI prompt templates
│   ├── models/             # Mongoose models
│   │   ├── User.js
│   │   ├── EducationEntry.js
│   │   ├── ExperienceEntry.js
│   │   ├── ProjectEntry.js
│   │   ├── SkillEntry.js
│   │   ├── AwardEntry.js
│   │   └── ProgressUpdate.js
│   └── .env.example        # Environment variables template
├── docs/                   # Documentation
│   ├── identity-vault-schema.md
│   ├── linkedin-suggestions-schema.md
│   ├── resume-generation-schema.md
│   ├── interview-schema.md
│   ├── api-endpoints.md
│   └── architecture.md
└── test/                   # Test data
    └── test-data.md        # Comprehensive test inputs
```

---

## 📊 Project Status

### ✅ Fully Completed

1. **Frontend UI & Integration**
   - All 7 pages fully designed and styled
   - Responsive layout with monospace aesthetic
   - Complete frontend-backend integration
   - Dynamic data loading from API
   - Full CRUD operations in UI
   - Error handling and loading states

2. **Backend API**
   - Complete CRUD operations for all entity types
   - AI-powered endpoints (progress updates, resume generation, interview prep)
   - LinkedIn suggestions generation
   - Unified error handling and response format
   - Input validation

3. **AI Integration**
   - Google Gemini API fully integrated
   - Entity extraction from natural language
   - LinkedIn content generation
   - Resume generation and formatting
   - Interview question generation
   - Interview feedback generation
   - Demo mode support (mock AI responses)

4. **Database Models**
   - 7 Mongoose models implemented with validation
   - All relationships defined
   - Complete schema definitions

5. **Documentation**
   - Complete API documentation
   - Data schema documentation
   - Architecture documentation
   - Test data guide

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key (for AI features)

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
   
   Copy the example environment file:
   ```bash
   cd back-end
   cp .env.example .env
   ```
   
   Edit `.env` and fill in your actual values:
   ```env
   # MongoDB Connection String
   # For local MongoDB: mongodb://localhost:27017/identitymaster
   # For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/identitymaster
   MONGO_URI=your_mongodb_connection_string
   
   # Google Gemini API Key (Required for AI features)
   # Get your API key from: https://aistudio.google.com/app/apikey
   GEMINI_API_KEY=your_gemini_api_key
   
   # Node Environment
   NODE_ENV=development
   
   # Server Port (default: 5001)
   PORT=5001
   
   # Demo Mode (optional - set to "true" to use mock AI responses)
   # Useful when API quota is exhausted
   DEMO_MODE=false
   ```

   **Getting your MongoDB connection string:**
   - **Local MongoDB**: Use `mongodb://localhost:27017/identitymaster` if you have MongoDB installed locally
   - **MongoDB Atlas** (Cloud - Recommended):
     - Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
     - Create a free cluster
     - Click "Connect" → "Connect your application"
     - Copy the connection string and replace `<password>` with your database password
   
   **Getting your Gemini API key:**
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated key to your `.env` file

4. **Start the backend server**
   ```bash
   cd back-end
   node src/index.js
   ```
   
   You should see:
   ```
   Connected to MongoDB
   Server running on http://localhost:5001
   ```

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

---

## 🧪 Testing Guide

### Cold Start Testing Order

IdentityMaster follows a **cold start** pattern - you need to populate the Identity Vault before using advanced features. Follow this order:

### Phase 1: Social Media Assistant (Populate Vault)

Use the Social Media Assistant to build your Identity Vault. See `test/test-data.md` for 14 comprehensive test inputs covering:
- **Education** (4 inputs): Graduation, Master's degree, courses, achievements
- **Experience** (3 inputs): Internships, research positions, contract work
- **Projects** (3 inputs): Personal projects, open source, hackathons
- **Skills** (2 inputs): Technical skills, new technologies
- **Awards** (2 inputs): Hackathon awards, academic recognition

**Steps:**
1. Open `social_media_assistant.html`
2. Enter each test input from `test/test-data.md`
3. Click "Send →" after each input
4. Wait for AI processing (or use demo mode)
5. Check Identity Vault to verify entries are created

### Phase 2: Resume Generator

After populating the vault, generate a tailored resume:

**Input:**
```
Company: Google
Position: Software Engineering Intern
Requirements: Backend development, distributed systems, Python or Go, API design, microservices architecture, database systems, system design, problem-solving skills, teamwork, software engineering best practices
```

**Steps:**
1. Open `smart_resume_builder.html`
2. Enter the job description above
3. Click "Generate Resume"
4. Review the AI-generated resume

### Phase 3: Interview Prep

After generating a resume, practice interviews:

**Input:**
```
Company: Google
Position: Software Engineering Intern
Requirements: Strong programming skills in Python or Go, experience with distributed systems and microservices, understanding of database systems and API design, system design thinking, problem-solving abilities, collaboration skills, software engineering fundamentals
```

**Steps:**
1. Open `interview_prep.html`
2. Enter the job description above
3. Click "Start Interview Session"
4. Answer AI's questions
5. Click "End Session" to receive feedback

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

### AI-Powered Features

- `POST /api/progress/update` - Submit progress update, extract entities, generate LinkedIn suggestions
- `GET /api/linkedin/suggestions` - Get LinkedIn update suggestions based on latest progress
- `POST /api/resume/generate` - Generate tailored resume based on job description
- `POST /api/interview/start` - Start new interview session
- `POST /api/interview/message` - Send message and get next question
- `POST /api/interview/end` - End interview and get feedback

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

## 🎭 Demo Mode

If you encounter API quota limits, you can enable **Demo Mode** to use mock AI responses:

1. Edit `back-end/.env`:
   ```env
   DEMO_MODE=true
   ```

2. Restart the backend server

3. All AI features will use simulated responses (no API calls)

Demo mode is perfect for:
- Testing without API quota
- Offline demonstrations
- Faster response times
- Controlled, predictable outputs

---

## 🧪 Testing

### Quick Test

1. Start the backend server
2. Open the frontend Dashboard
3. Use test data from `test/test-data.md` to populate the vault
4. Test all features in order (Social Media → Resume → Interview)

### Test API Directly

```bash
# Get vault statistics
curl http://localhost:5001/api/vault/stats

# Get all education entries
curl http://localhost:5001/api/education

# Submit progress update
curl -X POST http://localhost:5001/api/progress/update \
  -H "Content-Type: application/json" \
  -d '{"rawText": "I just graduated with a Bachelor of Science in Computer Science from University of Toronto."}'

# Generate resume
curl -X POST http://localhost:5001/api/resume/generate \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Google",
    "position": "Software Engineering Intern",
    "requirements": "Backend development, Python, distributed systems"
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

Test data guide:
- `test/test-data.md` - Comprehensive test inputs for cold start testing

---

## 🔧 Development

### Project Status

- **Frontend**: ✅ Complete UI with full integration
- **Backend API**: ✅ Complete CRUD + AI endpoints
- **Database**: ✅ All models implemented
- **AI Integration**: ✅ Fully functional with Google Gemini API
- **Error Handling**: ✅ Comprehensive error handling and loading states
- **Demo Mode**: ✅ Mock AI responses for testing

### Key Features Implemented

- ✅ Natural language progress updates → Atomic vault entries
- ✅ AI-powered LinkedIn suggestions generation
- ✅ Job-tailored resume generation
- ✅ Personalized interview simulation with feedback
- ✅ Complete Identity Vault CRUD operations
- ✅ Real-time statistics and dashboard
- ✅ User profile management

---

## 🎯 Use Cases

### For Job Seekers

1. **Track Your Progress**: Use Social Media Assistant to log achievements as they happen
2. **Build Your Vault**: Accumulate atomic, reusable professional information
3. **Generate Tailored Resumes**: Create job-specific resumes in seconds
4. **Practice Interviews**: Get personalized interview practice with AI feedback

### For Students

- Log coursework, projects, and achievements
- Build a comprehensive professional profile
- Prepare for internship and job applications
- Generate resumes for different opportunities

### For Professionals

- Maintain an up-to-date professional identity
- Quickly adapt resumes for different roles
- Practice interview skills
- Generate LinkedIn content

---

## 🚨 Troubleshooting

### API Quota Exceeded

If you see "429 Too Many Requests" errors:
1. Enable Demo Mode (set `DEMO_MODE=true` in `.env`)
2. Or wait for quota reset (usually hourly/daily)
3. Check your quota at [Google AI Studio](https://aistudio.google.com/app/apikey)

### Backend Not Starting

- Check MongoDB connection string in `.env`
- Ensure MongoDB is running (local) or cluster is accessible (Atlas)
- Check port 5001 is not in use

### Frontend Not Loading Data

- Ensure backend is running on `http://localhost:5001`
- Check browser console for errors
- Verify CORS is enabled (should be automatic)

### Data Not Saving

- Check backend logs for errors
- Verify MongoDB connection
- Check browser console for API errors

---

## 📝 License

Built for UofTHacks 13. See repository for license details.

---

## 👥 Team

Built at **UofTHacks 13**.

---

## 🙏 Acknowledgments

- **Google Gemini API** for AI capabilities
- **MongoDB** for data storage
- **UofTHacks 13** organizers and sponsors

---

**IdentityMaster** - Your professional identity, managed intelligently. 🚀
