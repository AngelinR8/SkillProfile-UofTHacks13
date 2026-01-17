# API Endpoints Documentation

This document defines all REST API endpoints for the OneProfile application.

**Base URL**: `http://localhost:5000/api`

All responses follow a consistent format:
- Success: HTTP 200/201 with JSON body
- Error: HTTP 4xx/5xx with JSON error message

---

## 1. Identity Vault Endpoints

### 1.1 User Profile

#### GET `/api/user/profile`
Get the current user's profile information.

**Response:**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "alex@example.com",
    "fullName": "Alex Chen",
    "phone": "+1-555-0123",
    "location": "Toronto, Canada",
    "linkedInUrl": "https://linkedin.com/in/alexchen",
    "githubUrl": "https://github.com/alexchen",
    "summary": "Computer Science student...",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-02-01T14:30:00Z"
  }
}
```

#### PUT `/api/user/profile`
Update user profile information.

**Request Body:**
```json
{
  "fullName": "Alex Chen",
  "phone": "+1-555-0123",
  "location": "Toronto, Canada",
  "linkedInUrl": "https://linkedin.com/in/alexchen",
  "githubUrl": "https://github.com/alexchen",
  "summary": "Updated summary..."
}
```

**Response:**
```json
{
  "status": "success",
  "user": { /* updated user object */ }
}
```

---

### 1.2 Education Entries

#### GET `/api/education`
Get all education entries for the current user.

**Response:**
```json
{
  "education": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "institution": "University of Toronto",
      "degree": "Bachelor of Science",
      "fieldOfStudy": "Computer Science",
      "startDate": "2022-09-01",
      "endDate": null,
      "gpa": 3.8,
      "description": "...",
      "achievements": ["Dean's List"],
      "tags": ["undergraduate", "technical"]
    }
  ]
}
```

#### POST `/api/education`
Create a new education entry.

**Request Body:**
```json
{
  "institution": "University of Toronto",
  "degree": "Bachelor of Science",
  "fieldOfStudy": "Computer Science",
  "startDate": "2022-09-01",
  "endDate": null,
  "gpa": 3.8,
  "description": "...",
  "achievements": ["Dean's List"],
  "tags": ["undergraduate"]
}
```

**Response:**
```json
{
  "status": "success",
  "education": { /* created education entry */ }
}
```

#### PUT `/api/education/:id`
Update an existing education entry.

**Request Body:** (same as POST, all fields optional)

**Response:**
```json
{
  "status": "success",
  "education": { /* updated education entry */ }
}
```

#### DELETE `/api/education/:id`
Delete an education entry.

**Response:**
```json
{
  "status": "success",
  "message": "Education entry deleted"
}
```

---

### 1.3 Experience Entries

#### GET `/api/experience`
Get all experience entries for the current user.

**Query Parameters:**
- `tags` (optional): Filter by tags (comma-separated)
- `employmentType` (optional): Filter by employment type

**Response:**
```json
{
  "experiences": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Software Engineering Intern",
      "company": "Google",
      "location": "Waterloo, Canada",
      "employmentType": "internship",
      "startDate": "2024-05-01",
      "endDate": "2024-08-31",
      "bullets": ["Built an internal React tool..."],
      "skills": ["507f1f77bcf86cd799439014"],
      "description": "...",
      "tags": ["technical", "frontend"]
    }
  ]
}
```

#### POST `/api/experience`
Create a new experience entry.

**Request Body:**
```json
{
  "title": "Software Engineering Intern",
  "company": "Google",
  "location": "Waterloo, Canada",
  "employmentType": "internship",
  "startDate": "2024-05-01",
  "endDate": "2024-08-31",
  "bullets": ["Built an internal React tool..."],
  "skills": ["507f1f77bcf86cd799439014"],
  "description": "...",
  "tags": ["technical"]
}
```

**Response:**
```json
{
  "status": "success",
  "experience": { /* created experience entry */ }
}
```

#### PUT `/api/experience/:id`
Update an existing experience entry.

**Request Body:** (same as POST, all fields optional)

**Response:**
```json
{
  "status": "success",
  "experience": { /* updated experience entry */ }
}
```

#### DELETE `/api/experience/:id`
Delete an experience entry.

**Response:**
```json
{
  "status": "success",
  "message": "Experience entry deleted"
}
```

---

### 1.4 Skill Entries

#### GET `/api/skills`
Get all skill entries for the current user.

**Query Parameters:**
- `category` (optional): Filter by category
- `proficiency` (optional): Filter by proficiency level

**Response:**
```json
{
  "skills": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "name": "React",
      "category": "framework",
      "proficiency": "intermediate",
      "yearsOfExperience": 2,
      "verifiedBy": ["507f1f77bcf86cd799439013"],
      "tags": ["frontend", "web"]
    }
  ]
}
```

#### POST `/api/skills`
Create a new skill entry.

**Request Body:**
```json
{
  "name": "React",
  "category": "framework",
  "proficiency": "intermediate",
  "yearsOfExperience": 2,
  "tags": ["frontend"]
}
```

**Response:**
```json
{
  "status": "success",
  "skill": { /* created skill entry */ }
}
```

#### PUT `/api/skills/:id`
Update an existing skill entry.

**Request Body:** (same as POST, all fields optional)

**Response:**
```json
{
  "status": "success",
  "skill": { /* updated skill entry */ }
}
```

#### DELETE `/api/skills/:id`
Delete a skill entry.

**Response:**
```json
{
  "status": "success",
  "message": "Skill entry deleted"
}
```

---

## 2. Progress Update & AI Processing Endpoints

### 2.1 Submit Progress Update

#### POST `/api/progress/update`
Submit a new progress update (raw text description). The system will:
1. Extract entities (education, experience, skills)
2. Use AI to polish and enhance the content
3. Store atomic entries in Identity Vault
4. Generate LinkedIn update suggestions

**Request Body:**
```json
{
  "rawText": "I just finished building a React app at my internship at Google. It was really exciting to work with the team on this project. I learned a lot about Python and automation."
}
```

**Response:**
```json
{
  "status": "success",
  "progressUpdateId": "507f1f77bcf86cd799439016",
  "extracted": {
    "experience": {
      "_id": "507f1f77bcf86cd799439017",
      "title": "Software Engineering Intern",
      "company": "Google",
      "bullets": ["Built a React application..."]
    },
    "skills": [
      {
        "_id": "507f1f77bcf86cd799439018",
        "name": "React"
      },
      {
        "_id": "507f1f77bcf86cd799439019",
        "name": "Python"
      }
    ]
  },
  "linkedInSuggestions": {
    /* See LinkedIn Update Output Schema */
  }
}
```

---

## 3. LinkedIn Update Generator Endpoints

### 3.1 Generate LinkedIn Updates

#### POST `/api/linkedin/generate`
Generate LinkedIn update suggestions based on a progress update ID or raw text.

**Request Body:**
```json
{
  "progressUpdateId": "507f1f77bcf86cd799439016"
}
```

**OR**

```json
{
  "rawText": "I just finished building a React app..."
}
```

**Response:**
```json
{
  "status": "success",
  "suggestions": {
    "education": { /* EducationUpdate object */ },
    "position": { /* PositionUpdate object */ },
    "skills": { /* SkillsUpdate object */ },
    "post": { /* PostUpdate object */ }
  }
}
```

**Note:** See `data-schema.md` for the detailed structure of each update type.

---

## 4. Resume Generator Endpoints

### 4.1 Generate Resume

#### POST `/api/resume/generate`
Generate a customized resume based on Identity Vault data and target job description.

**Request Body:**
```json
{
  "targetDescription": "Software Engineering Intern at Google. Looking for candidates with React, Python, and automation experience. Strong communication skills required.",
  "includeSections": ["experience", "education", "skills"],
  "style": "chronological" // or "functional" or "combination"
}
```

**Response:**
```json
{
  "status": "success",
  "resume": {
    "sections": {
      "experience": [
        {
          "title": "Software Engineering Intern",
          "company": "Google",
          "bullets": ["Built a React application to automate workflows..."]
        }
      ],
      "education": [
        {
          "institution": "University of Toronto",
          "degree": "Bachelor of Science in Computer Science",
          "gpa": 3.8
        }
      ],
      "skills": ["React", "Python", "JavaScript", "Automation"]
    },
    "summary": "AI-generated professional summary based on target...",
    "formatted": "Full formatted resume text (markdown or HTML)"
  }
}
```

---

## 5. Interview Simulator Endpoints

### 5.1 Start Interview Session

#### POST `/api/interview/start`
Start a new interview session with AI interviewer.

**Request Body:**
```json
{
  "jobTitle": "Software Engineering Intern",
  "companyName": "Google",
  "jobDescription": "We are looking for a software engineering intern...",
  "interviewType": "technical" // or "behavioral" or "mixed"
}
```

**Response:**
```json
{
  "status": "success",
  "sessionId": "507f1f77bcf86cd799439020",
  "initialQuestion": "Tell me about yourself and why you're interested in this position at Google.",
  "context": {
    "userProfile": { /* relevant user info */ },
    "targetJob": { /* job details */ }
  }
}
```

### 5.2 Continue Interview Conversation

#### POST `/api/interview/:sessionId/message`
Send a message (answer) in the interview session and receive the next question.

**Request Body:**
```json
{
  "message": "I'm a Computer Science student at UofT with experience in React and Python..."
}
```

**Response:**
```json
{
  "status": "success",
  "nextQuestion": "That's great! Can you walk me through a challenging project you worked on?",
  "feedback": {
    "strengths": ["Good technical depth", "Clear communication"],
    "improvements": ["Could provide more specific examples"],
    "score": 8.5
  },
  "conversation": [
    {
      "role": "interviewer",
      "content": "Tell me about yourself...",
      "timestamp": "2024-02-01T10:00:00Z"
    },
    {
      "role": "user",
      "content": "I'm a Computer Science student...",
      "timestamp": "2024-02-01T10:00:15Z"
    },
    {
      "role": "interviewer",
      "content": "That's great! Can you walk me through...",
      "timestamp": "2024-02-01T10:00:30Z"
    }
  ]
}
```

### 5.3 End Interview Session

#### POST `/api/interview/:sessionId/end`
End the interview session and get final feedback.

**Response:**
```json
{
  "status": "success",
  "finalFeedback": {
    "overallScore": 8.2,
    "strengths": [
      "Strong technical knowledge",
      "Good problem-solving approach"
    ],
    "areasForImprovement": [
      "Provide more quantifiable achievements",
      "Practice STAR method for behavioral questions"
    ],
    "recommendations": [
      "Review React hooks documentation",
      "Prepare 3-5 project stories using STAR format"
    ],
    "transcript": { /* full conversation transcript */ }
  }
}
```

---

## 6. Error Responses

All endpoints may return the following error formats:

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Invalid request data",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Internal server error",
  "error": "Detailed error message (development only)"
}
```

---

## 7. Authentication

**Note:** Authentication endpoints are TBD. Current implementation assumes user ID is passed via:
- Session token in headers
- User ID in request body (temporary, for development)

Future implementation should use:
- JWT tokens in `Authorization: Bearer <token>` header
- Or session-based authentication
