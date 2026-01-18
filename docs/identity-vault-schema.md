# Data Schema – Identity Vault

This document defines the core data models for the **Identity Vault**, the centralized repository where all atomic, AI-enhanced professional information is stored.

The Identity Vault serves as the single source of truth for a user's professional identity, broken down into atomic, reusable components that can be recombined for different purposes (resumes, LinkedIn, interviews, etc.).

---

## Overview

The Identity Vault contains six main entity types:

1. **User Profile** - Personal information and contact details
2. **Education Entries** - Atomic education records (degrees)
3. **Experience Entries** - Atomic work/employment records (jobs)
4. **Project Entries** - Atomic project records
5. **Skill Entries** - Atomic skill records with metadata
6. **Award Entries** - Atomic award/achievement records

All entries are stored independently and can be tagged, filtered, and recombined based on target context (job application, resume type, etc.).

---

## 1. User

Represents the user's basic profile information.

```ts
User {
  _id: ObjectId
  email?: string  // Optional since no login system
  fullName: string
  phone?: string
  location?: string
  links?: [{
    platform: "linkedin" | "github" | "twitter" | "personal" | "other"
    url: string
  }]
  summary?: string  // Brief professional summary/bio
  createdAt: Date
  updatedAt: Date
}
```

---

## 2. EducationEntry

Represents an atomic education record.

```ts
EducationEntry {
  _id: ObjectId
  userId: ObjectId  // Reference to User
  institution: string
  degree: string  // e.g., "Bachelor of Science", "Master of Engineering"
  fieldOfStudy: string  // e.g., "Computer Science", "Software Engineering"
  startDate: Date
  endDate?: Date  // null if currently enrolled
  gpa?: number
  description?: string  // AI-enhanced description
  achievements?: string[]  // List of notable achievements
  tags?: string[]  // For categorization (e.g., "undergraduate", "technical")
  createdAt: Date
  updatedAt: Date
}
```

---

## 3. ExperienceEntry

Represents an atomic work or project experience record.

```ts
ExperienceEntry {
  _id: ObjectId
  userId: ObjectId  // Reference to User
  title: string
  company?: string
  location?: string
  employmentType: "full-time" | "part-time" | "contract" | "internship" | "freelance"
  // Note: "project" removed - projects should use ProjectEntry instead
  startDate: Date
  endDate?: Date  // null if current position
  bullets: string[]  // Array of AI-enhanced bullet points
  skills: ObjectId[]  // References to SkillEntry documents
  description?: string  // Overall role description
  achievements?: string[]  // Quantifiable achievements
  tags?: string[]  // For categorization (e.g., "leadership", "technical", "frontend")
  createdAt: Date
  updatedAt: Date
}
```

---

## 4. SkillEntry

Represents an atomic skill record with proficiency and context.

```ts
SkillEntry {
  _id: ObjectId
  userId: ObjectId  // Reference to User
  name: string  // Skill name (e.g., "React", "Python", "Project Management")
  category: "programming" | "framework" | "tool" | "language" | "soft-skill" | "other"
  proficiency: "beginner" | "intermediate" | "advanced" | "expert"
  yearsOfExperience?: number
  verifiedBy?: ObjectId[]  // References to ExperienceEntry or EducationEntry that validate this skill
  tags?: string[]  // Additional categorization
  createdAt: Date
  updatedAt: Date
}
```

---

## 5. ProjectEntry

Represents an atomic project record.

```ts
ProjectEntry {
  _id: ObjectId
  userId: ObjectId  // Reference to User
  name: string  // Project name
  description?: string  // Overall project description
  startDate: Date
  endDate?: Date  // null if ongoing project
  bullets: string[]  // Array of AI-enhanced bullet points describing the project
  technologies: string[]  // Technologies used (e.g., "React", "Node.js", "MongoDB")
  skills: ObjectId[]  // References to SkillEntry documents
  url?: string  // Project URL (GitHub, demo, etc.)
  achievements?: string[]  // Notable achievements or outcomes
  tags?: string[]  // For categorization (e.g., "web", "mobile", "ai")
  createdAt: Date
  updatedAt: Date
}
```

---

## 6. AwardEntry

Represents an atomic award or achievement record.

```ts
AwardEntry {
  _id: ObjectId
  userId: ObjectId  // Reference to User
  title: string  // Award title (e.g., "Dean's List", "Best Hack")
  issuer?: string  // Organization/institution that issued the award
  date: Date  // When the award was received
  description?: string  // Description of the award and why it was received
  category: "academic" | "professional" | "competition" | "recognition" | "other"
  tags?: string[]  // For categorization (e.g., "hackathon", "academic")
  createdAt: Date
  updatedAt: Date
}
```

---

## 7. ProgressUpdate (Input Schema)

Represents the raw user input when they describe a new achievement or progress.

```ts
ProgressUpdate {
  _id: ObjectId
  userId: ObjectId
  rawText: string  // The user's natural language description
  processedAt?: Date  // When AI processing completed
  extractedEntities: {
    education?: Partial<EducationEntry>
    experience?: Partial<ExperienceEntry>
    project?: Partial<ProjectEntry>
    award?: Partial<AwardEntry>
    skills?: string[]  // Skill names extracted
  }
  aiEnhancement?: {
    polishedEducation?: Partial<EducationEntry>
    polishedExperience?: Partial<ExperienceEntry>
    polishedProject?: Partial<ProjectEntry>
    polishedAward?: Partial<AwardEntry>
    identifiedSkills?: string[]
  }
  createdAt: Date
}
```

---

## 8. Database Relationships

```
User (1) ──< (many) EducationEntry
User (1) ──< (many) ExperienceEntry
User (1) ──< (many) ProjectEntry
User (1) ──< (many) SkillEntry
User (1) ──< (many) AwardEntry
User (1) ──< (many) ProgressUpdate

ExperienceEntry (many) ──> (many) SkillEntry  // Through skills array
ProjectEntry (many) ──> (many) SkillEntry  // Through skills array
```

---

## 9. Example Data

### User Example

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "fullName": "Alex Chen",
  "phone": "+1-555-0123",
  "location": "Toronto, Canada",
  "links": [
    {
      "platform": "linkedin",
      "url": "https://linkedin.com/in/alexchen"
    },
    {
      "platform": "github",
      "url": "https://github.com/alexchen"
    }
  ],
  "summary": "Computer Science student passionate about full-stack development",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-02-01T14:30:00Z"
}
```

### EducationEntry Example

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "institution": "University of Toronto",
  "degree": "Bachelor of Science",
  "fieldOfStudy": "Computer Science",
  "startDate": "2022-09-01",
  "endDate": null,
  "gpa": 3.8,
  "description": "Pursuing a B.Sc. in Computer Science with focus on software engineering and AI",
  "achievements": ["Dean's List", "Winner of Hackathon 2024"],
  "tags": ["undergraduate", "technical"],
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-02-01T14:30:00Z"
}
```

### ExperienceEntry Example

```json
{
  "_id": "507f1f77bcf86cd799439013",
  "userId": "507f1f77bcf86cd799439011",
  "title": "Software Engineering Intern",
  "company": "Google",
  "location": "Waterloo, Canada",
  "employmentType": "internship",
  "startDate": "2024-05-01",
  "endDate": "2024-08-31",
  "bullets": [
    "Built an internal React + Python tool to automate repetitive workflows, improving team efficiency by 30%",
    "Collaborated with a team of 5 engineers to design and implement new features for production systems"
  ],
  "skills": ["507f1f77bcf86cd799439014", "507f1f77bcf86cd799439015"],
  "description": "Worked on internal tooling and automation projects",
  "achievements": ["Reduced manual work by 30%", "Shipped 3 major features"],
  "tags": ["technical", "frontend", "backend"],
  "createdAt": "2024-02-01T14:30:00Z",
  "updatedAt": "2024-08-31T18:00:00Z"
}
```

### SkillEntry Example

```json
{
  "_id": "507f1f77bcf86cd799439014",
  "userId": "507f1f77bcf86cd799439011",
  "name": "React",
  "category": "framework",
  "proficiency": "intermediate",
  "yearsOfExperience": 2,
  "verifiedBy": ["507f1f77bcf86cd799439013"],
  "tags": ["frontend", "web"],
  "createdAt": "2024-02-01T14:30:00Z",
  "updatedAt": "2024-08-31T18:00:00Z"
}
```

### ProjectEntry Example

```json
{
  "_id": "507f1f77bcf86cd799439016",
  "userId": "507f1f77bcf86cd799439011",
  "name": "OneProfile",
  "description": "AI-powered career assistant platform",
  "startDate": "2024-01-01",
  "endDate": null,
  "bullets": [
    "Built full-stack application using React and Node.js",
    "Integrated Gemini API for AI-powered content generation",
    "Implemented MongoDB for atomic data storage"
  ],
  "technologies": ["React", "Node.js", "MongoDB", "Gemini API"],
  "skills": ["507f1f77bcf86cd799439014"],
  "url": "https://github.com/alexchen/oneprofile",
  "achievements": ["Won Best Use of Gemini API at UofTHacks"],
  "tags": ["web", "ai", "full-stack"],
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-02-01T14:30:00Z"
}
```

### AwardEntry Example

```json
{
  "_id": "507f1f77bcf86cd799439017",
  "userId": "507f1f77bcf86cd799439011",
  "title": "Dean's List",
  "issuer": "University of Toronto",
  "date": "2024-01-15",
  "description": "Achieved Dean's List for academic excellence",
  "category": "academic",
  "tags": ["academic", "excellence"],
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-02-01T14:30:00Z"
}
```

---

## 10. Design Principles

1. **Atomicity**: Each entry is independent and can be used in multiple contexts
2. **AI Enhancement**: All descriptive text is AI-polished to be professional and impactful
3. **Traceability**: Skills link back to experiences that validate them
4. **Flexibility**: Tags and metadata allow for dynamic filtering and recombination
5. **Extensibility**: Schema can grow to support additional entity types (certifications, publications, etc.)
