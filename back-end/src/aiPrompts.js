/**
 * AI Prompts for entity extraction and content generation
 * This module contains all prompts used for AI processing
 */

/**
 * Generate prompt for extracting entities from raw user text
 * @param {string} rawText - The raw text input from the user
 * @param {Object} existingVaultData - User's existing Identity Vault data (all entry types)
 * @returns {string} - The formatted prompt for AI
 */
export function getEntityExtractionPrompt(rawText, existingVaultData = {}) {
  const prompt = `You are a professional career information extraction assistant. Analyze the following text and extract relevant career-related information.

**Raw Text:**
${rawText}

**User's Existing Identity Vault Data:**
${JSON.stringify(existingVaultData, null, 2)}

**Task:**
Extract all relevant career information from the raw text and return it in JSON format. Only extract NEW information that is not already in the existing vault data (unless it's an update to existing data).

**Output Format:**
Return a JSON object with the following structure. Each array should contain objects with the specified fields:

{
  "education": [
    {
      "institution": "string (required)",
      "degree": "string (required)",
      "fieldOfStudy": "string (required)",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD or null",
      "gpa": number or null,
      "description": "string (optional)",
      "achievements": ["string", ...] (optional)
    }
  ],
  "experience": [
    {
      "title": "string (required)",
      "company": "string (optional)",
      "location": "string (optional)",
      "employmentType": "full-time" | "part-time" | "contract" | "internship" | "freelance",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD or null",
      "bullets": ["string", ...] (optional),
      "description": "string (optional)",
      "achievements": ["string", ...] (optional)
    }
  ],
  "projects": [
    {
      "name": "string (required)",
      "description": "string (optional)",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD or null",
      "bullets": ["string", ...] (optional),
      "technologies": ["string", ...] (optional),
      "skills": ["string", ...] (optional),
      "url": "string (optional)",
      "achievements": ["string", ...] (optional)
    }
  ],
  "skills": [
    {
      "name": "string (required)",
      "category": "programming" | "framework" | "tool" | "language" | "soft-skill" | "other",
      "proficiency": "beginner" | "intermediate" | "advanced" | "expert",
      "yearsOfExperience": number or null
    }
  ],
  "awards": [
    {
      "title": "string (required)",
      "issuer": "string (optional)",
      "date": "YYYY-MM-DD",
      "description": "string (optional)",
      "category": "academic" | "professional" | "competition" | "recognition" | "other"
    }
  ]
}

**Instructions:**
1. Only extract information that is explicitly mentioned in the raw text
2. For dates:
   - If a date is explicitly mentioned, extract it in YYYY-MM-DD format
   - If only endDate is mentioned (e.g., "graduated in 2024"), infer startDate (e.g., for a 4-year degree, startDate would be 4 years before endDate)
   - If only startDate is mentioned, endDate can be null (ongoing)
   - If neither date is mentioned, try to infer from context (e.g., "just graduated" → recent endDate, "currently studying" → recent startDate, endDate null)
   - startDate is REQUIRED - if you cannot determine it, estimate based on context (e.g., typical degree duration)
3. For employmentType, infer from context (e.g., "internship" → "internship", "worked at" → "full-time")
4. For skills, try to infer category and proficiency from context if possible
5. If no information is found for a category, return an empty array []
6. Be accurate and only extract what is clearly stated or can be reasonably inferred from the text

Return ONLY the JSON object, no additional text or explanation.`;

  return prompt;
}

/**
 * Generate prompt for enhancing/polishing extracted entities
 * @param {Object} extractedEntities - The raw extracted entities
 * @returns {string} - The formatted prompt for AI enhancement
 */
export function getEntityEnhancementPrompt(extractedEntities) {
  const prompt = `You are a professional resume and LinkedIn content writer. Enhance the following career information to make it professional, impactful, and ready for resumes and LinkedIn profiles.

**Extracted Entities:**
${JSON.stringify(extractedEntities, null, 2)}

**Task:**
Enhance and polish the extracted information to make it more professional and impactful. Improve descriptions, bullet points, and achievements while maintaining accuracy.

**Output Format:**
Return a JSON object with the same structure as the input, but with enhanced content:
- Improve bullet points to be achievement-focused with metrics where possible
- Enhance descriptions to be concise and professional
- Ensure achievements are quantifiable and specific
- Maintain all factual information (dates, names, etc.) exactly as provided

Return ONLY the JSON object with enhanced content.`;

  return prompt;
}

/**
 * Generate prompt for LinkedIn update suggestions based on progress update
 * @param {Object} newProgress - The new progress update (from ProgressUpdate.extractedEntities)
 * @param {Object} vaultData - User's existing Identity Vault data
 * @param {string} rawText - The original raw text input from the user
 * @returns {string} - The formatted prompt for AI LinkedIn suggestions
 */
export function getLinkedInSuggestionsPrompt(newProgress, vaultData, rawText) {
  const prompt = `You are a professional LinkedIn content strategist. Based on the user's new progress update and their existing profile data, generate actionable LinkedIn update suggestions.

**User's New Progress Update:**
${JSON.stringify(newProgress, null, 2)}

**Original Raw Text:**
${rawText}

**User's Existing Identity Vault Data (Current LinkedIn Profile):**
${JSON.stringify(vaultData, null, 2)}

**Task:**
Analyze the new progress update and determine what LinkedIn sections should be updated. For each section, decide:
1. **shouldUpdate**: Should this section be updated? (true if there's new/updated information, false if nothing changed)
2. **suggestions**: If shouldUpdate is true, provide LinkedIn-ready content for that section

**Output Format:**
Return a JSON object with the following structure:

{
  "education": {
    "shouldUpdate": true/false,
    "suggestedEntry": {
      "institution": "string (required if shouldUpdate is true)",
      "program": "string (e.g., 'Bachelor of Science in Computer Science')",
      "duration": "string (e.g., '2020 - 2024' or '2024')",
      "description": "string (brief, LinkedIn-style description)"
    }
  },
  "position": {
    "shouldUpdate": true/false,
    "targetRole": "string (the role title to update, if shouldUpdate is true)",
    "suggestedBullet": "string (one LinkedIn-style bullet point, achievement-focused with metrics if possible)"
  },
  "skills": {
    "shouldUpdate": true/false,
    "add": ["string", ...] (array of new skill names to add),
    "strengthen": ["string", ...] (array of existing skills that should be highlighted),
    "reason": "string (brief explanation of why these skills are relevant)"
  },
  "post": {
    "shouldUpdate": true/false,
    "tone": "Professional" | "Casual" | "Enthusiastic" | "Reflective",
    "content": "string (LinkedIn post content, 2-4 sentences, engaging and professional)",
    "suggestedHashtags": ["string", ...] (array of 3-5 relevant hashtags, e.g., "#softwareengineering", "#learning")
  }
}

**Guidelines:**
1. **Education**: 
   - MUST suggest if there's ANY education-related information in the new progress update (e.g., "graduated", "completed degree", "finished program", "got my bachelor's/master's", etc.)
   - Even if dates are not explicitly mentioned, infer reasonable dates (e.g., "just graduated" → recent endDate, "graduated in 2024" → endDate 2024-05-15, startDate 4 years earlier for bachelor's)
   - Match the format: "Program Name at Institution" with duration
   - If only institution is mentioned (e.g., "graduated from University of Toronto"), infer a reasonable degree program based on context
2. **Position**: Only suggest if there's a new experience entry or a significant update to an existing role. The bullet should be achievement-focused and metric-driven if possible.
3. **Skills**: Only suggest if there are new skills mentioned or skills that gained new significance. "add" should list new skills; "strengthen" should list existing skills that should be highlighted.
4. **Post**: Only suggest if the progress update is significant enough to share publicly. The post should be engaging, professional, and include relevant hashtags.

**Instructions:**
- For Education: If the raw text mentions graduation, completion of studies, or any education milestone, ALWAYS set shouldUpdate to true and provide suggestions
- For other sections: Only set shouldUpdate to true if there's actually new or updated information for that section
- Be conservative for Position, Skills, and Post - it's better to skip an update than to suggest unnecessary changes
- But be LIBERAL for Education - if there's any education-related content, always suggest an update
- All content should be LinkedIn-ready (professional, concise, engaging)
- Use natural, conversational language for posts
- Include 3-5 relevant hashtags for posts

Return ONLY the JSON object, no additional text or explanation.`;

  return prompt;
}

/**
 * Generate prompt for resume generation based on job description and vault data
 * @param {Object} jobDescription - Target job description { company, position, requirements }
 * @param {Object} userProfile - User profile data from User model
 * @param {Object} vaultData - User's Identity Vault data (all entry types)
 * @returns {string} - The formatted prompt for AI resume generation
 */
export function getResumeGenerationPrompt(jobDescription, userProfile, vaultData) {
  const prompt = `You are a professional resume writer. Generate a customized resume based on the target job description and the user's Identity Vault data.

**Target Job Description:**
Company: ${jobDescription.company || "Not specified"}
Position: ${jobDescription.position || "Not specified"}
Requirements: ${jobDescription.requirements || "Not specified"}

**User Profile:**
${JSON.stringify(userProfile, null, 2)}

**User's Identity Vault Data:**
${JSON.stringify(vaultData, null, 2)}

**Task:**
Generate a one-page resume tailored specifically to the target job. Select and enhance only the MOST RELEVANT entries from the Identity Vault that match the job requirements.

**Output Format:**
Return a JSON object with the following structure:

{
  "header": {
    "name": "string (from User.fullName)",
    "email": "string (from User.email, optional)",
    "phone": "string (from User.phone, optional)",
    "links": [
      {
        "platform": "string (e.g., 'linkedin', 'github')",
        "url": "string"
      }
    ],
    "summary": "string (1-2 sentences, AI-generated professional summary based on User.summary + relevant vault data)"
  },
  "education": {
    "sectionTitle": "Education",
    "entries": [
      {
        "degreeName": "string (e.g., 'Bachelor of Science in Computer Science, GPA: 3.9')",
        "dateRange": "string (e.g., 'Sep 2022 - Present' or 'Sep 2022 - May 2026')",
        "bullets": ["string", "string", "string"] // Exactly 3 AI-enhanced bullet points in resume style
      }
    ]
  },
  "experience": {
    "sectionTitle": "Experience",
    "entries": [
      {
        "title": "string (e.g., 'Software Engineering Intern at Google')",
        "dateRange": "string (e.g., 'May 2024 - Aug 2024')",
        "bullets": ["string", "string", "string"] // Exactly 3 AI-enhanced bullet points in resume style
      }
    ] // Maximum 3 experiences
  },
  "skills": {
    "sectionTitle": "Skills",
    "bullets": ["string", "string", "string"] // 3-4 bullet points, each containing related skills (e.g., "JavaScript, Python, React | SQL, MongoDB")
  }
}

**Instructions:**
1. **Relevance First**: Only include entries that are relevant to the target job. Filter and prioritize based on job requirements.
2. **Quality Over Quantity**: 
   - Include ALL relevant education entries
   - Maximum 3 experiences (select the most relevant ones)
   - Include relevant skills, grouped logically
3. **Date Format**: Use "Month Year - Month Year" format (e.g., "May 2024 - Aug 2024") or "Month Year - Present" for ongoing
4. **Bullet Points**:
   - Education: Exactly 3 bullets per entry, in resume style (relevant coursework, achievements, GPA highlights)
   - Experience: Exactly 3 bullets per entry, achievement-focused with metrics when possible (e.g., "Built X reducing Y by Z%")
   - Skills: 3-4 bullets, each grouping related skills (e.g., "Programming Languages: JavaScript, Python, Java")
5. **Summary**: Generate a 1-2 sentence professional summary that highlights relevant experience and skills for the target job
6. **One Page Limit**: Ensure all content fits on one page. Be concise but impactful.
7. **Professional Tone**: All content should be polished, professional, and resume-ready.

**Guidelines for Bullet Points:**
- Start with action verbs (Built, Developed, Implemented, Optimized, etc.)
- Include quantifiable results when possible (e.g., "improved performance by 30%", "handled 1000+ requests/day")
- Be specific and concrete
- Focus on achievements, not just responsibilities
- Each bullet should be concise (one line when possible)

**Guidelines for Skills:**
- Group related skills together (e.g., programming languages, frameworks, tools)
- Each bullet should not exceed one line
- Prioritize skills mentioned in job requirements
- Format: "Category: skill1, skill2, skill3" or "skill1, skill2 | skill3, skill4"

Return ONLY the JSON object, no additional text or explanation.`;

  return prompt;
}

/**
 * Generate prompt for interview question generation
 * @param {Object} jobDescription - Target job description { company, position, requirements }
 * @param {Object} userProfile - User profile data from User model
 * @param {Object} vaultData - User's Identity Vault data (all entry types)
 * @param {Array} conversationHistory - Previous conversation messages
 * @param {number} questionNumber - Current question number (1 for first question)
 * @returns {string} - The formatted prompt for AI interview question generation
 */
export function getInterviewQuestionPrompt(jobDescription, userProfile, vaultData, conversationHistory = [], questionNumber = 1) {
  const isFirstQuestion = questionNumber === 1;
  
  const prompt = `You are a professional technical interviewer conducting a job interview. Generate an appropriate interview question based on the job description and the candidate's profile.

**Target Job:**
Company: ${jobDescription.company || "Not specified"}
Position: ${jobDescription.position || "Not specified"}
Requirements: ${jobDescription.requirements || "Not specified"}

**Candidate Profile:**
${JSON.stringify(userProfile, null, 2)}

**Candidate's Identity Vault (Background):**
${JSON.stringify(vaultData, null, 2)}

${isFirstQuestion ? `
**Task:**
Generate the FIRST interview question. This should be an opening question that:
1. Greets the candidate professionally
2. Introduces the interview context (position and company)
3. Asks a relevant question based on the job requirements and candidate's background
4. Can be technical, behavioral, or mixed, depending on what's most appropriate
` : `
**Previous Conversation:**
${JSON.stringify(conversationHistory, null, 2)}

**Task:**
Generate the NEXT interview question (Question #${questionNumber}). This should:
1. Build on the previous conversation
2. Ask a follow-up question based on the candidate's previous answer
3. Explore different aspects of their skills and experience
4. Progress naturally through the interview
5. Can be technical, behavioral, or mixed
`}

**Output Format:**
Return a JSON object with the following structure:

{
  "question": "string (the interview question to ask, including greeting if first question)",
  "type": "technical" | "behavioral" | "mixed",
  "hint": "string (optional, a brief hint about what the interviewer is looking for)"
}

**Guidelines:**
1. **First Question**: Should include a professional greeting and context about the interview
2. **Follow-up Questions**: Should reference or build upon previous answers naturally
3. **Question Types**:
   - **Technical**: Focus on technical skills, problem-solving, coding, system design
   - **Behavioral**: Focus on past experiences, teamwork, challenges, using STAR format
   - **Mixed**: Combination of technical and behavioral aspects
4. **Personalization**: Use the candidate's background (projects, experiences, skills) to ask relevant questions
5. **Job Relevance**: Questions should align with the job requirements
6. **Natural Flow**: Questions should feel like a real interview conversation
7. **Appropriate Difficulty**: Match the question difficulty to the position level (intern vs senior)

**Examples:**
- First question: "Hello! Thank you for taking the time to interview for the Software Engineering Intern position at Google. I've reviewed your profile and see you have experience with React and Python. Let's start with a technical question: Can you walk me through how you would optimize the performance of a React application that's experiencing slow rendering?"
- Follow-up: "That's a great approach. Can you tell me about a specific project where you implemented performance optimizations? What challenges did you face?"

Return ONLY the JSON object, no additional text or explanation.`;

  return prompt;
}

/**
 * Generate prompt for interview feedback generation
 * @param {Array} conversationHistory - Complete conversation history
 * @param {Object} jobDescription - Target job description
 * @param {Object} userProfile - User profile data
 * @returns {string} - The formatted prompt for AI interview feedback generation
 */
export function getInterviewFeedbackPrompt(conversationHistory, jobDescription, userProfile) {
  const prompt = `You are a professional interview evaluator. Analyze the complete interview conversation and provide comprehensive feedback.

**Interview Conversation:**
${JSON.stringify(conversationHistory, null, 2)}

**Target Job:**
Company: ${jobDescription.company || "Not specified"}
Position: ${jobDescription.position || "Not specified"}
Requirements: ${jobDescription.requirements || "Not specified"}

**Candidate Profile:**
${JSON.stringify(userProfile, null, 2)}

**Task:**
Analyze the entire interview conversation and provide structured feedback including:
1. Overall performance score (0-5 scale)
2. Key strengths demonstrated
3. Areas for improvement
4. Specific actionable recommendations
5. Detailed breakdown by category (technical, communication, problem-solving, cultural fit)

**Output Format:**
Return a JSON object with the following structure:

{
  "overallScore": number (0-5, can be decimal like 4.2),
  "strengths": ["string", "string", ...] (at least 3-5 strengths),
  "areasForImprovement": ["string", "string", ...] (at least 3-5 areas),
  "recommendations": ["string", "string", ...] (at least 3-5 specific actionable recommendations),
  "breakdown": {
    "technical": number (0-5),
    "communication": number (0-5),
    "problemSolving": number (0-5),
    "culturalFit": number (0-5)
  }
}

**Scoring Guidelines:**
- **Overall Score (0-5)**: Weighted average considering all aspects
- **Technical (0-5)**: Depth of technical knowledge, problem-solving approach, code quality
- **Communication (0-5)**: Clarity, structure, ability to explain technical concepts
- **Problem Solving (0-5)**: Approach to challenges, critical thinking, creativity
- **Cultural Fit (0-5)**: Alignment with company values, teamwork, growth mindset

**Feedback Guidelines:**
1. **Strengths**: Be specific and reference actual answers from the conversation
2. **Areas for Improvement**: Be constructive and actionable
3. **Recommendations**: Provide specific, actionable steps the candidate can take
4. **Be Balanced**: Include both positive and constructive feedback
5. **Be Specific**: Reference specific moments or answers from the conversation
6. **Be Professional**: Maintain a supportive and encouraging tone

Return ONLY the JSON object, no additional text or explanation.`;

  return prompt;
}
