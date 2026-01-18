# Data Schema – Interview Simulator

This document defines the data structures and flows for the **Interview Simulator**, where AI conducts personalized interview sessions based on job descriptions and user profile from Identity Vault.

---

## Overview

The Interview Simulator provides:
1. **Personalized Questions**: AI generates questions based on job requirements and user profile
2. **Real-time Feedback**: Provides feedback after each answer
3. **Full Session Management**: Tracks conversation throughout interview
4. **Final Assessment**: Comprehensive scoring and recommendations at session end

---

## Interview Session Structure

### InterviewSession

Represents a complete interview session.

```ts
InterviewSession {
  _id: ObjectId
  userId: ObjectId
  jobTarget: {
    company: string
    position: string
    requirements: string    // Job description and requirements
  }
  status: "active" | "completed" | "ended"
  startedAt: Date
  endedAt?: Date
  conversation: ConversationMessage[]
  finalFeedback?: InterviewFeedback
  createdAt: Date
  updatedAt: Date
}
```

### ConversationMessage

Single message in the interview conversation.

```ts
ConversationMessage {
  role: "interviewer" | "user"
  content: string
  timestamp: Date
  feedback?: {              // Optional: feedback on user's answer
    score?: number          // 0-5 scale (per answer)
    strengths?: string[]
    improvements?: string[]
  }
}
```

### InterviewFeedback

Final feedback provided when interview ends.

```ts
InterviewFeedback {
  overallScore: number      // 0-5 scale (out of 5)
  strengths: string[]       // List of key strengths demonstrated
  areasForImprovement: string[]  // Areas that need work
  recommendations: string[] // Specific actionable recommendations
  breakdown?: {
    technical?: number      // Technical skills score (0-5)
    communication?: number  // Communication score (0-5)
    problemSolving?: number // Problem-solving score (0-5)
    culturalFit?: number    // Cultural fit score (0-5)
  }
}
```

---

## AI Processing Flow

### Input for Question Generation

```ts
InterviewQuestionInput {
  jobTarget: {
    company: string
    position: string
    requirements: string
  }
  userProfile: {
    profile: User
    education: EducationEntry[]
    experiences: ExperienceEntry[]
    projects: ProjectEntry[]
    skills: SkillEntry[]
  }
  conversationHistory: ConversationMessage[]
  questionNumber: number
  interviewType?: "technical" | "behavioral" | "mixed"
}
```

### AI Question Generation

AI generates questions based on:
1. **Job Requirements**: Technical skills, experience level, company culture
2. **User Profile**: Relevant experiences, projects, skills from Identity Vault
3. **Conversation Context**: Previous answers to ask follow-up questions
4. **Interview Type**: Technical vs behavioral vs mixed

### Question Types

#### Technical Questions
- Based on required technical skills from job description
- Related to user's projects and experiences
- Examples: "Tell me about a challenging technical problem you solved"

#### Behavioral Questions
- STAR format (Situation, Task, Action, Result)
- Based on user's experiences from Identity Vault
- Examples: "Describe a time when you had to work in a team"

#### Mixed Questions
- Combination of technical and behavioral
- Customized to job and user profile

### Response Processing

When user provides an answer:

```ts
AnswerProcessingInput {
  question: string
  answer: string
  conversationHistory: ConversationMessage[]
  jobTarget: JobTarget
  userProfile: UserProfile
}
```

AI processes answer and:
1. **Analyzes** answer quality, relevance, completeness
2. **Provides Feedback** (optional per answer):
   - Score (0-5)
   - Strengths identified
   - Areas for improvement
3. **Generates Next Question** based on:
   - Answer quality
   - Gaps in assessment
   - Interview progression

---

## Session Lifecycle

### 1. Start Interview

**Input:**
```json
{
  "jobTitle": "Software Engineering Intern",
  "companyName": "Google",
  "jobDescription": "We are looking for a software engineering intern...",
  "interviewType": "mixed"
}
```

**AI Process:**
- Loads user profile from Identity Vault
- Analyzes job requirements
- Generates initial greeting and first question

**Output:**
```json
{
  "sessionId": "507f1f77bcf86cd799439020",
  "initialQuestion": "Hello! I'm conducting your interview for the Software Engineering Intern position at Google. Based on your profile, I can see you have experience with React and Python. Let's begin - can you tell me about a challenging technical project you've worked on?",
  "status": "active"
}
```

### 2. Continue Conversation

**Input:**
```json
{
  "sessionId": "507f1f77bcf86cd799439020",
  "message": "I worked on a React project where I had to optimize rendering performance..."
}
```

**AI Process:**
- Analyzes answer quality
- Provides optional real-time feedback
- Generates follow-up question

**Output:**
```json
{
  "nextQuestion": "That's great! Can you walk me through the specific optimization techniques you used?",
  "feedback": {
    "strengths": ["Clear explanation", "Technical depth"],
    "improvements": ["Could mention specific metrics"],
    "score": 4.0
  },
  "conversation": [
    { /* previous messages */ },
    { "role": "user", "content": "...", "timestamp": "2024-02-01T10:00:15Z" },
    { "role": "interviewer", "content": "...", "timestamp": "2024-02-01T10:00:30Z" }
  ]
}
```

### 3. End Interview

**Input:**
```json
{
  "sessionId": "507f1f77bcf86cd799439020",
  "endedBy": "user" | "ai"  // User manually ended or AI determined completion
}
```

**AI Process:**
- Analyzes entire conversation
- Scores overall performance (0-5)
- Identifies strengths and weaknesses
- Provides specific recommendations

**Output:**
```json
{
  "finalFeedback": {
    "overallScore": 4.2,
    "strengths": [
      "Strong technical knowledge in React and Python",
      "Clear communication style",
      "Good problem-solving approach demonstrated"
    ],
    "areasForImprovement": [
      "Could provide more quantifiable achievements",
      "Practice STAR method for behavioral questions",
      "Mention specific impact metrics more often"
    ],
    "recommendations": [
      "Review React performance optimization techniques",
      "Prepare 3-5 project stories using STAR format",
      "Practice explaining technical concepts to non-technical audiences",
      "Study Google's engineering culture and values"
    ],
    "breakdown": {
      "technical": 4.5,
      "communication": 4.0,
      "problemSolving": 4.3,
      "culturalFit": 4.0
    }
  },
  "transcript": [ /* full conversation */ ]
}
```

---

## Scoring Criteria

### Technical (0-5)
- Depth of technical knowledge
- Problem-solving approach
- Code quality and best practices
- System design thinking

### Communication (0-5)
- Clarity of explanation
- Structure and organization
- Ability to explain technical concepts
- Active listening and response relevance

### Problem Solving (0-5)
- Approach to challenges
- Critical thinking
- Creativity in solutions
- Learning from failures

### Cultural Fit (0-5)
- Alignment with company values
- Teamwork and collaboration
- Growth mindset
- Professional attitude

---

## Design Principles

1. **Personalization**: Questions tailored to user's profile and job requirements
2. **Realistic Simulation**: Mimics real interview experience
3. **Constructive Feedback**: Focuses on actionable improvements
4. **Comprehensive Assessment**: Multiple dimensions scored
5. **Flexible Session**: User can end at any time, AI can determine completion

---

## Notes

- Interview can be ended manually by user or automatically by AI when sufficient assessment is made
- AI maintains context throughout conversation for coherent follow-up questions
- Feedback can be provided per answer (optional) or only at end (configurable)
- Session transcript is saved for review and improvement
- AI uses Identity Vault data to customize questions to user's actual experiences
