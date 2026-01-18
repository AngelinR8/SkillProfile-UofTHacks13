# Data Schema – Resume Generation Output

This document defines the structured output format for **Resume Generation**, where AI processes Identity Vault atomic entries and generates customized resume content based on target job descriptions.

---

## Overview

The Resume Builder generates tailored resumes by:
1. **Retrieving** relevant atomic entries from Identity Vault
2. **Filtering** entries based on job requirements
3. **AI Enhancement** - Re-polishing and formatting content for resume style
4. **Structuring** into standardized resume format with 4 main components

---

## Resume Structure

A generated resume consists of four main components:

### 1. Header Component

Resume header containing personal information and brief introduction.

```ts
ResumeHeader {
  name: string           // From User.fullName
  email?: string         // From User profile
  phone?: string         // From User profile
  links: [{              // From User.links
    platform: string
    url: string
  }]
  summary: string        // AI-generated 1-2 sentence professional summary
                         // Based on User.summary + Identity Vault content
}
```

### 2. Education Component

Education section with hierarchical structure.

```ts
ResumeEducation {
  sectionTitle: "Education"
  entries: [{
    degreeName: string          // e.g., "Bachelor of Science in Computer Science, GPA: 3.9"
                                // Combined from EducationEntry.degree + fieldOfStudy + gpa
    dateRange: string           // e.g., "Sep 2022 - Present"
                                // Formatted from EducationEntry.startDate + endDate
    bullets: string[]           // Exactly 3 AI-enhanced bullet points
                                // Generated from EducationEntry data in resume style
  }]
}
```

**Format Rules:**
- **First Level**: "Education" (section title)
- **Second Level**: Degree name with GPA (if available)
- **Third Level**: Date range (Month Year - Month Year format)
- **Fourth Level**: 3 bullet points in resume style

### 3. Experience Component

Experience section with multiple entries (typically 3 entries maximum).

```ts
ResumeExperience {
  sectionTitle: "Experience"
  entries: [{
    title: string              // e.g., "Software Engineering Intern at Google"
                               // From ExperienceEntry.title + company
    dateRange: string          // e.g., "May 2024 - Aug 2024"
                               // Formatted from ExperienceEntry.startDate + endDate
    bullets: string[]          // Exactly 3 AI-enhanced bullet points
                               // Generated from ExperienceEntry.bullets, polished for resume
  }]
}
```

**Format Rules:**
- **First Level**: "Experience" (section title)
- **Second Level**: Job title and company
- **Third Level**: Date range (Month Year - Month Year format)
- **Fourth Level**: 3 bullet points describing accomplishments
- **Limit**: Maximum 3 experiences to fit one page

### 4. Skills Component

Skills section without hierarchical dates.

```ts
ResumeSkills {
  sectionTitle: "Skills"
  bullets: string[]            // 3-4 bullet points
                               // Each bullet: groups of related skills
                               // e.g., "JavaScript, Python, React, Node.js | SQL, MongoDB"
}
```

**Format Rules:**
- **First Level**: "Skills" (section title)
- **No Second/Third Level**: Direct to bullets
- **Bullets**: 3-4 bullet points, each containing related skills
- **Length**: Each bullet should not exceed one line
- **Grouping**: Skills grouped by category (e.g., programming languages, tools, frameworks)

---

## AI Processing Flow

### Input

```ts
ResumeGenerationInput {
  targetJob: {
    company: string
    position: string
    requirements: string     // Job description and requirements
  }
  userProfile: User          // User personal information
  identityVault: {
    education: EducationEntry[]
    experiences: ExperienceEntry[]
    projects?: ProjectEntry[]  // Optional: may be used if relevant
    skills: SkillEntry[]
    awards?: AwardEntry[]      // Optional: may be used if relevant
  }
}
```

### Processing Steps

1. **Relevance Scoring**: AI scores each atomic entry based on job requirements
2. **Selection**: Selects top relevant entries (3 experiences max, all education, relevant skills)
3. **Enhancement**: AI re-polishes selected entries into resume format:
   - Converts bullets to resume-style (action verbs, quantifiable results)
   - Ensures professional tone
   - Maintains consistency
4. **Formatting**: Structures into 4 components with proper hierarchy
5. **Length Control**: Ensures total resume fits one page

### Output

```ts
ResumeGenerationOutput {
  header: ResumeHeader
  education: ResumeEducation
  experience: ResumeExperience
  skills: ResumeSkills
  formattedText?: string      // Full formatted resume (optional)
                              // Markdown or HTML format
}
```

---

## Example Output

### Header

```json
{
  "name": "Alex Chen",
  "email": "alex.chen@example.com",
  "phone": "+1-555-0123",
  "links": [
    { "platform": "linkedin", "url": "https://linkedin.com/in/alexchen" },
    { "platform": "github", "url": "https://github.com/alexchen" }
  ],
  "summary": "Computer Science student with experience in full-stack development, AI integration, and database design. Passionate about building scalable applications and solving complex technical challenges."
}
```

### Education

```json
{
  "sectionTitle": "Education",
  "entries": [
    {
      "degreeName": "Bachelor of Science in Computer Science, GPA: 3.9",
      "dateRange": "Sep 2022 - Present",
      "bullets": [
        "Relevant coursework: Data Structures, Algorithms, Database Systems, Machine Learning",
        "Dean's List recipient for academic excellence",
        "Research assistant in AI applications for web development"
      ]
    }
  ]
}
```

### Experience

```json
{
  "sectionTitle": "Experience",
  "entries": [
    {
      "title": "Software Engineering Intern at Google",
      "dateRange": "May 2024 - Aug 2024",
      "bullets": [
        "Built internal React + Python automation tool, reducing manual workflow time by 30%",
        "Collaborated with team of 5 engineers to design and implement production features",
        "Optimized database queries, improving system response time by 25%"
      ]
    },
    {
      "title": "Full-Stack Developer at Tech Startup",
      "dateRange": "Jan 2023 - Dec 2023",
      "bullets": [
        "Developed RESTful APIs using Node.js and Express, handling 1000+ requests/day",
        "Implemented React frontend components, improving user engagement by 40%",
        "Designed MongoDB database schema supporting scalable data architecture"
      ]
    }
  ]
}
```

### Skills

```json
{
  "sectionTitle": "Skills",
  "bullets": [
    "Programming Languages: JavaScript, Python, Java, SQL",
    "Frameworks & Libraries: React, Node.js, Express, MongoDB",
    "Tools & Technologies: Git, Docker, AWS, REST APIs"
  ]
}
```

---

## Design Principles

1. **Relevance First**: Only include entries relevant to target job
2. **Quality Over Quantity**: Prefer 3 strong experiences over 5 weak ones
3. **One Page Limit**: All content must fit on one page
4. **Consistency**: Uniform formatting and style throughout
5. **Action-Oriented**: Bullets start with action verbs and include quantifiable results
6. **Professional Tone**: All content polished to professional resume standards

---

## Notes

- Projects and Awards are **optional** - only included if highly relevant to job
- AI determines relevance through prompt engineering and keyword matching
- Date formats follow "Month Year - Month Year" convention (e.g., "May 2024 - Aug 2024")
- Skills are grouped logically (e.g., languages together, tools together)
- All bullet points are AI-enhanced from original Identity Vault entries
