# Data Schema – Identity Vault

This document defines the core data models for the **Identity Vault**, the centralized repository where all atomic, AI-enhanced professional information is stored.

The Identity Vault serves as the single source of truth for a user's professional identity, broken down into atomic, reusable components that can be recombined for different purposes (resumes, LinkedIn, interviews, etc.).

---

## Overview

The Identity Vault contains four main entity types:

1. **User Profile** - Personal information and contact details
2. **Education Entries** - Atomic education records
3. **Experience Entries** - Atomic work/experience records
4. **Skill Entries** - Atomic skill records with metadata

All entries are stored independently and can be tagged, filtered, and recombined based on target context (job application, resume type, etc.).

---

## 1. User

Represents the user's basic profile information.

```ts
User {
  _id: ObjectId
  email: string
  fullName: string
  phone?: string
  location?: string
  linkedInUrl?: string
  githubUrl?: string
  personalWebsite?: string
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
  company?: string  // null for personal projects
  location?: string
  employmentType: "full-time" | "part-time" | "contract" | "internship" | "freelance" | "project"
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

## 5. ProgressUpdate (Input Schema)

Represents the raw user input when they describe a new achievement or progress.

```ts
ProgressUpdate {
  _id: ObjectId
  userId: ObjectId
  rawText: string  // The user's natural language description
  processedAt: Date  // When AI processing completed
  extractedEntities: {
    education?: Partial<EducationEntry>
    experience?: Partial<ExperienceEntry>
    skills?: string[]  // Skill names extracted
  }
  aiEnhancement?: {
    polishedEducation?: EducationEntry
    polishedExperience?: ExperienceEntry
    identifiedSkills?: string[]
  }
  createdAt: Date
}
```

---

## 6. Database Relationships

```
User (1) ──< (many) EducationEntry
User (1) ──< (many) ExperienceEntry
User (1) ──< (many) SkillEntry
User (1) ──< (many) ProgressUpdate

ExperienceEntry (many) ──> (many) SkillEntry  // Through skills array
```

---

## 7. Example Data

### User Example

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "alex@example.com",
  "fullName": "Alex Chen",
  "phone": "+1-555-0123",
  "location": "Toronto, Canada",
  "linkedInUrl": "https://linkedin.com/in/alexchen",
  "githubUrl": "https://github.com/alexchen",
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

---

## 8. Design Principles

1. **Atomicity**: Each entry is independent and can be used in multiple contexts
2. **AI Enhancement**: All descriptive text is AI-polished to be professional and impactful
3. **Traceability**: Skills link back to experiences that validate them
4. **Flexibility**: Tags and metadata allow for dynamic filtering and recombination
5. **Extensibility**: Schema can grow to support additional entity types (certifications, publications, etc.)
