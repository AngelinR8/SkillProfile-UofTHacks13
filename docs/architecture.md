# System Architecture

This document describes the overall architecture of IdentityMaster, including system components, data flow, and key design decisions.

---

## Overview

IdentityMaster is a full-stack web application that helps users manage their professional identity across multiple platforms. The system consists of:

- **Frontend**: HTML/CSS/JavaScript web application
- **Backend**: Express.js REST API server
- **Database**: MongoDB for persistent data storage
- **AI Service**: Google Gemini API for content generation and processing
- **Identity Vault**: Centralized atomic data repository

---

## High-Level Architecture

```
┌─────────────┐
│   User      │
│  (Browser)  │
└──────┬──────┘
       │
       │ HTTP/REST API
       │
┌──────▼─────────────────────────────────────┐
│        Frontend (HTML/CSS/JS)              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ Social   │  │ Identity │  │ Resume   │ │
│  │  Media   │  │  Vault   │  │ Builder  │ │
│  │Assistant │  └──────────┘  └──────────┘ │
│  └──────────┘                              │
│  ┌──────────┐  ┌──────────┐               │
│  │Dashboard │  │Interview │               │
│  │          │  │   Prep   │               │
│  └──────────┘  └──────────┘               │
└──────┬─────────────────────────────────────┘
       │
       │ REST API Calls
       │
┌──────▼─────────────────────────────────────┐
│        Backend (Express.js)                │
│  ┌─────────────────────────────────────┐  │
│  │         API Routes Layer            │  │
│  │  /api/user, /api/education, etc.    │  │
│  └──────────────┬──────────────────────┘  │
│                 │                          │
│  ┌──────────────▼──────────────────────┐  │
│  │      Business Logic Layer           │  │
│  │  - Progress Update Processor        │  │
│  │  - AI Content Generator             │  │
│  │  - Resume Builder                   │  │
│  │  - Interview Session Manager        │  │
│  └──────────────┬──────────────────────┘  │
│                 │                          │
│  ┌──────────────▼──────────────────────┐  │
│  │      Data Access Layer              │  │
│  │  (Mongoose Models)                  │  │
│  └──────────────┬──────────────────────┘  │
└─────────────────┼──────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
┌───────▼────────┐  ┌──────▼──────────┐
│   MongoDB      │  │  Gemini API     │
│   Database     │  │  (AI Service)   │
└────────────────┘  └─────────────────┘
```

---

## Component Breakdown

### 1. Frontend Components

#### Main Pages/Views
- **Dashboard**: Overview of user's profile, vault stats, quick actions
- **Social Media Assistant**: Chat interface to submit progress updates, generate LinkedIn suggestions
- **Identity Vault**: View and manage all atomic profile entries (education, experience, projects, skills, awards)
- **Smart Resume Builder**: Interface to generate customized resumes based on job targets
- **Interview Prep**: Chat interface for AI-powered interview practice
- **Profile**: User personal information management
- **Account Settings**: Privacy and preference settings

#### State Management
- User profile state
- Identity Vault entries state
- Current resume/job target state
- Interview session state

---

### 2. Backend Services

#### API Route Handlers (`/api/*`)
- **User Profile Routes**: GET/PUT `/api/user/profile`
- **Identity Vault Routes**: 
  - `/api/education` (CRUD)
  - `/api/experience` (CRUD)
  - `/api/projects` (CRUD)
  - `/api/skills` (CRUD)
  - `/api/awards` (CRUD)
  - GET `/api/vault/stats` - Get statistics for all entry types
- **Progress Update Routes**: POST `/api/progress/update`
- **LinkedIn Routes**: POST `/api/linkedin/generate`
- **Resume Routes**: POST `/api/resume/generate`
- **Interview Routes**: 
  - POST `/api/interview/start`
  - POST `/api/interview/:sessionId/message`
  - POST `/api/interview/:sessionId/end`

#### Business Logic Services
- **ProgressUpdateProcessor**: 
  - Receives raw text input
  - Calls AI to extract entities
  - Creates/updates Identity Vault entries
  - Triggers LinkedIn suggestion generation

- **AIContentGenerator**:
  - Entity extraction from natural language
  - Content enhancement/polishing
  - LinkedIn update generation
  - Resume content generation
  - Interview question generation

- **ResumeBuilder**:
  - Filters Identity Vault entries based on job target
  - Recombines entries into resume format
  - Applies formatting/styling

- **InterviewSessionManager**:
  - Manages interview conversation state
  - Generates contextual questions based on user profile and job description
  - Provides real-time feedback

---

### 3. Database Schema

#### Collections (MongoDB)
1. **users**: User profile information
2. **educationEntries**: Atomic education records (degrees)
3. **experienceEntries**: Atomic work/employment records (jobs)
4. **projectEntries**: Atomic project records
5. **skillEntries**: Atomic skill records
6. **awardEntries**: Atomic award/achievement records
7. **progressUpdates**: Raw progress update history

See `identity-vault-schema.md` for detailed schema definitions.

---

### 4. AI Integration

#### Google Gemini API Usage

**Entity Extraction:**
- Input: Raw user text describing progress
- Output: Structured entities (education, experience, skills)
- Model: `gemini-pro`
- Purpose: Parse natural language into structured data

**Content Enhancement:**
- Input: Extracted raw entities
- Output: Polished, professional descriptions
- Model: `gemini-pro`
- Purpose: Make content resume/LinkedIn-ready

**LinkedIn Update Generation:**
- Input: Progress update + current Identity Vault state
- Output: LinkedIn update suggestions (education, position, skills, post)
- Model: `gemini-pro`
- Purpose: Generate platform-specific content

**Resume Generation:**
- Input: Job target description + Identity Vault entries
- Output: Customized resume content
- Model: `gemini-pro`
- Purpose: Match user profile to job requirements

**Interview Question Generation:**
- Input: Job description + user profile from Identity Vault
- Output: Contextual interview questions
- Model: `gemini-pro`
- Purpose: Create realistic interview scenarios

See `ai-integration.md` (to be created) for detailed prompt engineering.

---

## Data Flow

### Flow 1: Progress Update → Identity Vault → LinkedIn Suggestions

```
User Input (raw text)
    ↓
Backend receives POST /api/progress/update
    ↓
AI Processing:
  1. Extract entities (education, experience, skills)
  2. Enhance/polish extracted content
    ↓
Save to Identity Vault:
  - Create/update EducationEntry
  - Create/update ExperienceEntry
  - Create/update SkillEntry
    ↓
Generate LinkedIn Suggestions:
  - AI analyzes new data + existing vault
  - Generates education/position/skills/post updates
    ↓
Return response:
  - New Identity Vault entries
  - LinkedIn update suggestions
```

### Flow 2: Identity Vault → Resume Generation

```
User specifies job target
    ↓
Backend receives POST /api/resume/generate
    ↓
Query Identity Vault:
  - Filter entries relevant to job target
  - Score/reorder entries by relevance
    ↓
AI Processing:
  - Recombine entries into resume format
  - Enhance bullets for job fit
  - Generate professional summary
    ↓
Return formatted resume
```

### Flow 3: Interview Session

```
User starts interview session (job description)
    ↓
Backend creates session, loads:
  - User profile from Identity Vault
  - Job description
    ↓
AI generates initial question
    ↓
User responds
    ↓
AI analyzes response + generates next question
    ↓
[Loop continues...]
    ↓
User ends session
    ↓
AI generates final feedback and recommendations
```

---

## Key Design Decisions

### 1. Atomic Data Model
**Decision**: Store all professional information as independent, atomic entries in Identity Vault.

**Rationale**:
- Flexibility: Same data can be reused for multiple purposes (resume, LinkedIn, interviews)
- Maintainability: Update once, use everywhere
- AI Enhancement: Easier to process and enhance atomic pieces
- Scalability: Can easily add new output formats (Twitter, portfolio, etc.)

### 2. Centralized Identity Vault
**Decision**: Single source of truth for all professional data.

**Rationale**:
- Consistency: All outputs are based on the same data
- Traceability: Can see history of updates
- Efficiency: No data duplication

### 3. AI-First Processing
**Decision**: Use AI to extract, enhance, and generate all content.

**Rationale**:
- Natural input: Users can type naturally, no rigid forms
- Professional output: AI polishes content to be LinkedIn/resume-ready
- Personalization: AI can tailor content for specific job targets
- Scalability: AI can handle variety of input formats and styles

### 4. RESTful API Design
**Decision**: Use REST API for backend-frontend communication.

**Rationale**:
- Standard: Easy to understand and implement
- Stateless: Scales well
- Clear separation: Frontend and backend can be developed independently

---

## Technology Stack

### Frontend
- **Technology**: HTML, CSS, JavaScript
- **HTTP Client**: Fetch API
- **Styling**: Inline CSS and external stylesheets
- **No Framework**: Pure HTML/CSS/JS implementation

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **AI Service**: Google Gemini API
- **Environment**: dotenv for configuration

### Deployment
- **Frontend**: Vercel (as mentioned in README)
- **Backend**: (TBD - could be Vercel, Railway, Render, AWS, etc.)
- **Database**: MongoDB Atlas (cloud)

---

## Security Considerations

### Current State
- Basic CORS configuration
- Environment variables for sensitive data (MongoDB URI, API keys)

### Future Considerations
- **Authentication**: Implement user authentication (JWT tokens or sessions)
- **Authorization**: Ensure users can only access their own data
- **API Rate Limiting**: Prevent abuse of AI API calls
- **Input Validation**: Validate all user inputs
- **Data Encryption**: Encrypt sensitive data at rest
- **HTTPS**: Use HTTPS in production

---

## Scalability Considerations

### Current Architecture
- Single backend server
- Direct MongoDB connection
- Direct Gemini API calls

### Future Scaling Options
- **Caching**: Cache frequently accessed Identity Vault data
- **Queue System**: Queue AI processing jobs for better performance
- **Database Indexing**: Add indexes on frequently queried fields
- **CDN**: Use CDN for frontend assets
- **Load Balancing**: Multiple backend instances if traffic grows

---

## Development Workflow

1. **Local Development**:
   - Frontend: `npm run dev` (React dev server)
   - Backend: `node src/index.js` or `nodemon`
   - Database: MongoDB Atlas (cloud) or local MongoDB
   - Environment: `.env` file with API keys

2. **Testing**:
   - Manual testing through frontend
   - API testing with Postman/Thunder Client
   - (Future) Automated tests

3. **Deployment**:
   - Frontend: Deploy to Vercel
   - Backend: Deploy to chosen platform
   - Environment variables: Configure in deployment platform

---

## Related Documents

- `identity-vault-schema.md` - Detailed Identity Vault data models
- `linkedin-suggestions-schema.md` - LinkedIn suggestions output formats
- `resume-generation-schema.md` - Resume generation data structures
- `interview-schema.md` - Interview simulator data structures
- `api-endpoints.md` - Complete API documentation

---

## Next Steps

1. **Build AI Services**: Implement AI integration for each use case (Social Media, Resume, Interview)
2. **Add Error Handling**: Comprehensive error handling across all routes
3. **Add Logging**: Log important events and errors
4. **Performance Optimization**: Optimize database queries and AI API calls
5. **Testing**: Write tests for critical paths

---

*Last Updated: [Date]*
