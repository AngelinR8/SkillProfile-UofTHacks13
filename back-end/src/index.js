import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { callGemini, callGeminiJSON } from "./aiService.js";
import { getEntityExtractionPrompt, getEntityEnhancementPrompt, getLinkedInSuggestionsPrompt, getResumeGenerationPrompt, getInterviewQuestionPrompt, getInterviewFeedbackPrompt } from "./aiPrompts.js";

// Import all models
import User from "../models/User.js";
import EducationEntry from "../models/EducationEntry.js";
import ExperienceEntry from "../models/ExperienceEntry.js";
import ProjectEntry from "../models/ProjectEntry.js";
import SkillEntry from "../models/SkillEntry.js";
import AwardEntry from "../models/AwardEntry.js";
import ProgressUpdate from "../models/ProgressUpdate.js";

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const app = express();
const PORT = process.env.PORT || 5001; // Use 5001 instead of 5000 (5000 is often taken by AirPlay on macOS)

// Middleware
app.use(cors()); // Allow frontend to access this API
app.use(express.json()); // Parse JSON request bodies

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    status: "error", 
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

// Helper function for consistent success responses
const sendSuccess = (res, data, statusCode = 200) => {
  res.status(statusCode).json({
    status: "success",
    ...data
  });
};

// Helper function for consistent error responses
const sendError = (res, message, statusCode = 400, errors = null) => {
  const response = {
    status: "error",
    message
  };
  if (errors) {
    response.errors = errors;
  }
  res.status(statusCode).json(response);
};

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Test endpoints
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// Test AI endpoint
app.get("/api/test/ai", async (req, res) => {
  try {
    const testPrompt = "Say 'Hello from Gemini AI!' in a friendly way.";
    const response = await callGemini(testPrompt);
    sendSuccess(res, { 
      message: "AI test successful",
      prompt: testPrompt,
      response: response
    });
  } catch (error) {
    sendError(res, `AI test failed: ${error.message}`, 500);
  }
});

// Test endpoint: Create education entry WITHOUT AI (for debugging)
app.post("/api/test/education", async (req, res) => {
  try {
    const { institution, degree, fieldOfStudy, startDate, endDate } = req.body;
    
    if (!institution || !degree || !fieldOfStudy || !startDate) {
      return sendError(res, "Missing required fields: institution, degree, fieldOfStudy, startDate", 400);
    }

    const educationEntry = await EducationEntry.create({
      userId: DEMO_USER_ID,
      institution,
      degree,
      fieldOfStudy,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      gpa: req.body.gpa || null,
      description: req.body.description || null
    });

    sendSuccess(res, { message: "Education entry created (no AI)", educationEntry }, 201);
  } catch (error) {
    sendError(res, `Failed to create education entry: ${error.message}`, 500);
  }
});

// ============================================
// IDENTITY VAULT API ENDPOINTS
// ============================================

// For demo purposes, we'll use a hardcoded userId
// In production, this would come from authentication
const DEMO_USER_ID = "65f1234567890abcdef12345"; // Replace with actual user ID in production

// Interview session storage (in-memory for demo)
// In production, this would be stored in database
const interviewSessions = new Map(); // sessionId -> session data
let nextSessionId = 1;

// --------------------------------------------
// USER PROFILE ENDPOINTS
// --------------------------------------------

// GET user profile
app.get("/api/user/profile", async (req, res) => {
  try {
    // For demo, use DEMO_USER_ID or create one with default data
    let user = await User.findOne({ _id: DEMO_USER_ID });
    if (!user) {
      // Create default demo user with complete information
      user = await User.create({
        _id: DEMO_USER_ID,
        fullName: "Alex Chen",
        email: "alex.chen@mail.utoronto.ca",
        phone: "+1-416-555-0123",
        location: "Toronto, ON, Canada",
        summary: "Computer science student specializing in ML and AI with strong research and development background",
        links: [
          { platform: "linkedin", url: "https://linkedin.com/in/alexchen" },
          { platform: "github", url: "https://github.com/alexchen" }
        ]
      });
    }
    sendSuccess(res, { user });
  } catch (error) {
    sendError(res, error.message, 500);
  }
});

// PUT update user profile
app.put("/api/user/profile", async (req, res) => {
  try {
    // Use DEMO_USER_ID for demo
    let user = await User.findOne({ _id: DEMO_USER_ID });
    if (!user) {
      // Create user with provided data and DEMO_USER_ID
      user = await User.create({
        _id: DEMO_USER_ID,
        ...req.body
      });
    } else {
      // Update existing user
      user = await User.findByIdAndUpdate(DEMO_USER_ID, req.body, { new: true, runValidators: true });
    }
    sendSuccess(res, { user });
  } catch (error) {
    sendError(res, error.message, 400);
  }
});

// --------------------------------------------
// EDUCATION ENDPOINTS
// --------------------------------------------

// GET all education entries
app.get("/api/education", async (req, res) => {
  try {
    const education = await EducationEntry.find({ userId: DEMO_USER_ID }).sort({ startDate: -1 });
    sendSuccess(res, { education });
  } catch (error) {
    sendError(res, error.message, 500);
  }
});

// POST create education entry
app.post("/api/education", async (req, res) => {
  try {
    // Basic validation
    if (!req.body.institution || !req.body.degree || !req.body.fieldOfStudy) {
      return sendError(res, "Missing required fields: institution, degree, fieldOfStudy", 400);
    }
    
    const educationData = {
      ...req.body,
      userId: DEMO_USER_ID
    };
    const education = await EducationEntry.create(educationData);
    sendSuccess(res, { education }, 201);
  } catch (error) {
    sendError(res, error.message, 400);
  }
});

// PUT update education entry
app.put("/api/education/:id", async (req, res) => {
  try {
    const education = await EducationEntry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!education) {
      return sendError(res, "Education entry not found", 404);
    }
    sendSuccess(res, { education });
  } catch (error) {
    sendError(res, error.message, 400);
  }
});

// DELETE education entry
app.delete("/api/education/:id", async (req, res) => {
  try {
    const education = await EducationEntry.findByIdAndDelete(req.params.id);
    if (!education) {
      return sendError(res, "Education entry not found", 404);
    }
    sendSuccess(res, { message: "Education entry deleted" });
  } catch (error) {
    sendError(res, error.message, 500);
  }
});

// --------------------------------------------
// EXPERIENCE ENDPOINTS
// --------------------------------------------

// GET all experience entries
app.get("/api/experience", async (req, res) => {
  try {
    const experiences = await ExperienceEntry.find({ userId: DEMO_USER_ID })
      .populate("skills")
      .sort({ startDate: -1 });
    sendSuccess(res, { experiences });
  } catch (error) {
    sendError(res, error.message, 500);
  }
});

// POST create experience entry
app.post("/api/experience", async (req, res) => {
  try {
    if (!req.body.title || !req.body.employmentType) {
      return sendError(res, "Missing required fields: title, employmentType", 400);
    }
    
    const experienceData = {
      ...req.body,
      userId: DEMO_USER_ID
    };
    const experience = await ExperienceEntry.create(experienceData);
    sendSuccess(res, { experience }, 201);
  } catch (error) {
    sendError(res, error.message, 400);
  }
});

// PUT update experience entry
app.put("/api/experience/:id", async (req, res) => {
  try {
    const experience = await ExperienceEntry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!experience) {
      return sendError(res, "Experience entry not found", 404);
    }
    sendSuccess(res, { experience });
  } catch (error) {
    sendError(res, error.message, 400);
  }
});

// DELETE experience entry
app.delete("/api/experience/:id", async (req, res) => {
  try {
    const experience = await ExperienceEntry.findByIdAndDelete(req.params.id);
    if (!experience) {
      return sendError(res, "Experience entry not found", 404);
    }
    sendSuccess(res, { message: "Experience entry deleted" });
  } catch (error) {
    sendError(res, error.message, 500);
  }
});

// --------------------------------------------
// SKILLS ENDPOINTS
// --------------------------------------------

// GET all skill entries
app.get("/api/skills", async (req, res) => {
  try {
    const skills = await SkillEntry.find({ userId: DEMO_USER_ID }).sort({ name: 1 });
    sendSuccess(res, { skills });
  } catch (error) {
    sendError(res, error.message, 500);
  }
});

// POST create skill entry
app.post("/api/skills", async (req, res) => {
  try {
    if (!req.body.name || !req.body.category || !req.body.proficiency) {
      return sendError(res, "Missing required fields: name, category, proficiency", 400);
    }
    
    const skillData = {
      ...req.body,
      userId: DEMO_USER_ID
    };
    const skill = await SkillEntry.create(skillData);
    sendSuccess(res, { skill }, 201);
  } catch (error) {
    sendError(res, error.message, 400);
  }
});

// PUT update skill entry
app.put("/api/skills/:id", async (req, res) => {
  try {
    const skill = await SkillEntry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!skill) {
      return sendError(res, "Skill entry not found", 404);
    }
    sendSuccess(res, { skill });
  } catch (error) {
    sendError(res, error.message, 400);
  }
});

// DELETE skill entry
app.delete("/api/skills/:id", async (req, res) => {
  try {
    const skill = await SkillEntry.findByIdAndDelete(req.params.id);
    if (!skill) {
      return sendError(res, "Skill entry not found", 404);
    }
    sendSuccess(res, { message: "Skill entry deleted" });
  } catch (error) {
    sendError(res, error.message, 500);
  }
});

// --------------------------------------------
// PROJECT ENDPOINTS
// --------------------------------------------

// GET all project entries
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await ProjectEntry.find({ userId: DEMO_USER_ID })
      .populate("skills")
      .sort({ startDate: -1 });
    sendSuccess(res, { projects });
  } catch (error) {
    sendError(res, error.message, 500);
  }
});

// POST create project entry
app.post("/api/projects", async (req, res) => {
  try {
    if (!req.body.name) {
      return sendError(res, "Missing required field: name", 400);
    }
    
    const projectData = {
      ...req.body,
      userId: DEMO_USER_ID
    };
    const project = await ProjectEntry.create(projectData);
    sendSuccess(res, { project }, 201);
  } catch (error) {
    sendError(res, error.message, 400);
  }
});

// PUT update project entry
app.put("/api/projects/:id", async (req, res) => {
  try {
    const project = await ProjectEntry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!project) {
      return sendError(res, "Project entry not found", 404);
    }
    sendSuccess(res, { project });
  } catch (error) {
    sendError(res, error.message, 400);
  }
});

// DELETE project entry
app.delete("/api/projects/:id", async (req, res) => {
  try {
    const project = await ProjectEntry.findByIdAndDelete(req.params.id);
    if (!project) {
      return sendError(res, "Project entry not found", 404);
    }
    sendSuccess(res, { message: "Project entry deleted" });
  } catch (error) {
    sendError(res, error.message, 500);
  }
});

// --------------------------------------------
// AWARD ENDPOINTS
// --------------------------------------------

// GET all award entries
app.get("/api/awards", async (req, res) => {
  try {
    const awards = await AwardEntry.find({ userId: DEMO_USER_ID })
      .sort({ date: -1 });
    sendSuccess(res, { awards });
  } catch (error) {
    sendError(res, error.message, 500);
  }
});

// POST create award entry
app.post("/api/awards", async (req, res) => {
  try {
    if (!req.body.title || !req.body.date) {
      return sendError(res, "Missing required fields: title, date", 400);
    }
    
    const awardData = {
      ...req.body,
      userId: DEMO_USER_ID
    };
    const award = await AwardEntry.create(awardData);
    sendSuccess(res, { award }, 201);
  } catch (error) {
    sendError(res, error.message, 400);
  }
});

// PUT update award entry
app.put("/api/awards/:id", async (req, res) => {
  try {
    const award = await AwardEntry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!award) {
      return sendError(res, "Award entry not found", 404);
    }
    sendSuccess(res, { award });
  } catch (error) {
    sendError(res, error.message, 400);
  }
});

// DELETE award entry
app.delete("/api/awards/:id", async (req, res) => {
  try {
    const award = await AwardEntry.findByIdAndDelete(req.params.id);
    if (!award) {
      return sendError(res, "Award entry not found", 404);
    }
    sendSuccess(res, { message: "Award entry deleted" });
  } catch (error) {
    sendError(res, error.message, 500);
  }
});

// --------------------------------------------
// VAULT STATISTICS ENDPOINT
// --------------------------------------------

// GET vault statistics
app.get("/api/vault/stats", async (req, res) => {
  try {
    const [degrees, experiences, projects, skills, awards] = await Promise.all([
      EducationEntry.countDocuments({ userId: DEMO_USER_ID }),
      ExperienceEntry.countDocuments({ userId: DEMO_USER_ID }),
      ProjectEntry.countDocuments({ userId: DEMO_USER_ID }),
      SkillEntry.countDocuments({ userId: DEMO_USER_ID }),
      AwardEntry.countDocuments({ userId: DEMO_USER_ID })
    ]);

    const total = degrees + experiences + projects + skills + awards;

    sendSuccess(res, {
      stats: {
        degrees,
        experiences,
        projects,
        skills,
        awards,
        total
      }
    });
  } catch (error) {
    sendError(res, error.message, 500);
  }
});

// --------------------------------------------
// PROGRESS UPDATE ENDPOINTS
// --------------------------------------------

// POST create progress update
app.post("/api/progress/update", async (req, res) => {
  try {
    // Basic validation
    if (!req.body.rawText || typeof req.body.rawText !== "string") {
      return sendError(res, "Missing or invalid field: rawText (must be a string)", 400);
    }

    const rawText = req.body.rawText.trim();
    console.log(`[Progress Update] Received raw text: "${rawText.substring(0, 100)}..."`);

    // Step 1: Get user's existing Identity Vault data
    console.log(`[Progress Update] Step 1: Fetching existing vault data...`);
    const [existingEducation, existingExperience, existingProjects, existingSkills, existingAwards] = await Promise.all([
      EducationEntry.find({ userId: DEMO_USER_ID }).lean(),
      ExperienceEntry.find({ userId: DEMO_USER_ID }).lean(),
      ProjectEntry.find({ userId: DEMO_USER_ID }).lean(),
      SkillEntry.find({ userId: DEMO_USER_ID }).lean(),
      AwardEntry.find({ userId: DEMO_USER_ID }).lean()
    ]);

    const existingVaultData = {
      education: existingEducation,
      experience: existingExperience,
      projects: existingProjects,
      skills: existingSkills,
      awards: existingAwards
    };

    // Step 2: Generate entity extraction prompt
    console.log(`[Progress Update] Step 2: Generating extraction prompt...`);
    const extractionPrompt = getEntityExtractionPrompt(rawText, existingVaultData);

    // Step 3: Call AI to extract entities
    console.log(`[Progress Update] Step 3: Calling AI for entity extraction... (this may take 2-5 seconds)`);
    let extractedEntities = {};
    try {
      const aiResponse = await callGeminiJSON(extractionPrompt);
      console.log(`[Progress Update] AI extraction completed. Extracted:`, {
        education: aiResponse.education?.length || 0,
        experience: aiResponse.experience?.length || 0,
        projects: aiResponse.projects?.length || 0,
        skills: aiResponse.skills?.length || 0,
        awards: aiResponse.awards?.length || 0
      });
      extractedEntities = {
        education: aiResponse.education || [],
        experience: aiResponse.experience || [],
        projects: aiResponse.projects || [],
        skills: aiResponse.skills || [],
        awards: aiResponse.awards || []
      };
    } catch (aiError) {
      console.error("[Progress Update] AI extraction error:", aiError.message);
      // If AI extraction fails, still save the progress update with empty entities
      extractedEntities = {
        education: [],
        experience: [],
        projects: [],
        skills: [],
        awards: []
      };
    }

    // Step 4: Create database entries from extracted entities
    console.log(`[Progress Update] Step 4: Creating database entries...`);
    const createdEntries = {
      education: [],
      experience: [],
      projects: [],
      skills: [],
      awards: []
    };

    // Create Education entries
    if (extractedEntities.education && extractedEntities.education.length > 0) {
      for (const eduData of extractedEntities.education) {
        // If startDate is missing but endDate exists, infer startDate (e.g., 4 years before for bachelor's)
        let startDate = eduData.startDate ? new Date(eduData.startDate) : null;
        const endDate = eduData.endDate ? new Date(eduData.endDate) : null;
        
        // If startDate is missing, try to infer from endDate
        if (!startDate && endDate) {
          // For bachelor's degree, typically 4 years; for master's, 2 years
          const degreeType = (eduData.degree || "").toLowerCase();
          let yearsToSubtract = 4; // Default for bachelor's
          if (degreeType.includes("master") || degreeType.includes("m.s") || degreeType.includes("m.a")) {
            yearsToSubtract = 2;
          } else if (degreeType.includes("phd") || degreeType.includes("doctorate")) {
            yearsToSubtract = 5;
          }
          startDate = new Date(endDate);
          startDate.setFullYear(startDate.getFullYear() - yearsToSubtract);
        }
        
        // If still no startDate, skip this entry (startDate is required)
        if (!startDate) {
          console.warn("Skipping education entry: startDate is required but could not be determined", eduData);
          continue;
        }

        const educationEntry = await EducationEntry.create({
          userId: DEMO_USER_ID,
          institution: eduData.institution,
          degree: eduData.degree,
          fieldOfStudy: eduData.fieldOfStudy || "General",
          startDate: startDate,
          endDate: endDate,
          gpa: eduData.gpa || null,
          description: eduData.description || null,
          achievements: eduData.achievements || []
        });
        createdEntries.education.push(educationEntry._id);
      }
    }

    // Create Experience entries
    if (extractedEntities.experience && extractedEntities.experience.length > 0) {
      for (const expData of extractedEntities.experience) {
        // startDate is required for ExperienceEntry
        let startDate = expData.startDate ? new Date(expData.startDate) : null;
        const endDate = expData.endDate ? new Date(expData.endDate) : null;
        
        // If startDate is missing but endDate exists, infer startDate (e.g., 3-6 months before for internships)
        if (!startDate && endDate) {
          startDate = new Date(endDate);
          // For internships, typically 3-4 months; for full-time, infer based on context
          const employmentType = (expData.employmentType || "").toLowerCase();
          if (employmentType.includes("intern")) {
            startDate.setMonth(startDate.getMonth() - 4);
          } else {
            startDate.setMonth(startDate.getMonth() - 6);
          }
        }
        
        // If still no startDate, skip this entry
        if (!startDate) {
          console.warn("Skipping experience entry: startDate is required but could not be determined", expData);
          continue;
        }

        const experienceEntry = await ExperienceEntry.create({
          userId: DEMO_USER_ID,
          title: expData.title,
          company: expData.company || "",
          location: expData.location || "",
          employmentType: expData.employmentType || "full-time",
          startDate: startDate,
          endDate: endDate,
          bullets: expData.bullets || [],
          description: expData.description || null,
          achievements: expData.achievements || []
        });
        createdEntries.experience.push(experienceEntry._id);
      }
    }

    // Create Project entries
    if (extractedEntities.projects && extractedEntities.projects.length > 0) {
      for (const projData of extractedEntities.projects) {
        // startDate is required for ProjectEntry
        let startDate = projData.startDate ? new Date(projData.startDate) : null;
        const endDate = projData.endDate ? new Date(projData.endDate) : null;
        
        // If startDate is missing but endDate exists, infer startDate (e.g., 3 months before)
        if (!startDate && endDate) {
          startDate = new Date(endDate);
          startDate.setMonth(startDate.getMonth() - 3);
        }
        
        // If still no startDate, skip this entry
        if (!startDate) {
          console.warn("Skipping project entry: startDate is required but could not be determined", projData);
          continue;
        }

        const projectEntry = await ProjectEntry.create({
          userId: DEMO_USER_ID,
          name: projData.name,
          description: projData.description || "",
          startDate: startDate,
          endDate: endDate,
          bullets: projData.bullets || [],
          technologies: projData.technologies || [],
          url: projData.url || null,
          achievements: projData.achievements || []
        });
        createdEntries.projects.push(projectEntry._id);
      }
    }

    // Create Skill entries
    if (extractedEntities.skills && extractedEntities.skills.length > 0) {
      for (const skillData of extractedEntities.skills) {
        const skillEntry = await SkillEntry.create({
          userId: DEMO_USER_ID,
          name: skillData.name,
          category: skillData.category || "other",
          proficiency: skillData.proficiency || "intermediate",
          yearsOfExperience: skillData.yearsOfExperience || null
        });
        createdEntries.skills.push(skillEntry._id);
      }
    }

    // Create Award entries
    if (extractedEntities.awards && extractedEntities.awards.length > 0) {
      for (const awardData of extractedEntities.awards) {
        const awardEntry = await AwardEntry.create({
          userId: DEMO_USER_ID,
          title: awardData.title,
          issuer: awardData.issuer || "",
          date: awardData.date ? new Date(awardData.date) : new Date(),
          description: awardData.description || null,
          category: awardData.category || "other"
        });
        createdEntries.awards.push(awardEntry._id);
      }
    }

    // Step 5: Save ProgressUpdate with extracted entities
    const progressUpdateData = {
      userId: DEMO_USER_ID,
      rawText: rawText,
      processedAt: new Date(),
      extractedEntities: extractedEntities,
      aiEnhancement: {} // Enhancement can be added later if needed
    };

    const progressUpdate = await ProgressUpdate.create(progressUpdateData);
    
    console.log(`[Progress Update] Completed! Created entries:`, {
      education: createdEntries.education.length,
      experience: createdEntries.experience.length,
      projects: createdEntries.projects.length,
      skills: createdEntries.skills.length,
      awards: createdEntries.awards.length
    });

    sendSuccess(res, {
      progressUpdate,
      createdEntries: {
        education: createdEntries.education.length,
        experience: createdEntries.experience.length,
        projects: createdEntries.projects.length,
        skills: createdEntries.skills.length,
        awards: createdEntries.awards.length
      }
    }, 201);
  } catch (error) {
    console.error("Progress update error:", error);
    sendError(res, error.message, 400);
  }
});

// GET all progress updates (optional, for testing/debugging)
app.get("/api/progress/updates", async (req, res) => {
  try {
    const updates = await ProgressUpdate.find({ userId: DEMO_USER_ID })
      .sort({ createdAt: -1 });
    sendSuccess(res, { updates });
  } catch (error) {
    sendError(res, error.message, 500);
  }
});

// --------------------------------------------
// LINKEDIN SUGGESTIONS ENDPOINTS
// --------------------------------------------

// GET LinkedIn suggestions based on latest or specific progress update
app.get("/api/linkedin/suggestions", async (req, res) => {
  try {
    // Optional: support progressUpdateId query parameter
    const progressUpdateId = req.query.progressUpdateId;
    
    let progressUpdate;
    if (progressUpdateId) {
      progressUpdate = await ProgressUpdate.findOne({ 
        _id: progressUpdateId, 
        userId: DEMO_USER_ID 
      });
      if (!progressUpdate) {
        return sendError(res, "Progress update not found", 404);
      }
    } else {
      // Get latest progress update
      progressUpdate = await ProgressUpdate.findOne({ userId: DEMO_USER_ID })
        .sort({ createdAt: -1 });
      if (!progressUpdate) {
        return sendError(res, "No progress updates found. Please submit a progress update first.", 404);
      }
    }

    // Get existing vault data for context
    const [existingEducation, existingExperience, existingProjects, existingSkills, existingAwards] = await Promise.all([
      EducationEntry.find({ userId: DEMO_USER_ID }).lean(),
      ExperienceEntry.find({ userId: DEMO_USER_ID }).lean(),
      ProjectEntry.find({ userId: DEMO_USER_ID }).lean(),
      SkillEntry.find({ userId: DEMO_USER_ID }).lean(),
      AwardEntry.find({ userId: DEMO_USER_ID }).lean()
    ]);

    const vaultData = {
      education: existingEducation,
      experience: existingExperience,
      projects: existingProjects,
      skills: existingSkills,
      awards: existingAwards
    };

    // Generate LinkedIn suggestions prompt
    const newProgress = progressUpdate.extractedEntities || {};
    const rawText = progressUpdate.rawText || "";
    
    console.log(`[LinkedIn Suggestions] Generating suggestions for progress update: ${progressUpdate._id}`);
    const suggestionsPrompt = getLinkedInSuggestionsPrompt(newProgress, vaultData, rawText);
    
    // Call AI to generate suggestions
    const suggestionsResponse = await callGeminiJSON(suggestionsPrompt);
    
    console.log(`[LinkedIn Suggestions] Generated suggestions:`, {
      education: suggestionsResponse.education?.shouldUpdate || false,
      position: suggestionsResponse.position?.shouldUpdate || false,
      skills: suggestionsResponse.skills?.shouldUpdate || false,
      post: suggestionsResponse.post?.shouldUpdate || false
    });

    sendSuccess(res, {
      suggestions: suggestionsResponse,
      progressUpdateId: progressUpdate._id
    });
  } catch (error) {
    console.error("[LinkedIn Suggestions] Error:", error);
    sendError(res, `Failed to generate LinkedIn suggestions: ${error.message}`, 500);
  }
});

// --------------------------------------------
// RESUME GENERATION ENDPOINTS
// --------------------------------------------

// POST generate resume based on job description
app.post("/api/resume/generate", async (req, res) => {
  try {
    const { company, position, requirements } = req.body;

    if (!company || !position || !requirements) {
      return sendError(res, "Missing required fields: company, position, requirements", 400);
    }

    const jobDescription = {
      company: company.trim(),
      position: position.trim(),
      requirements: requirements.trim()
    };

    console.log(`[Resume Generation] Generating resume for: ${position} at ${company}`);

    // Step 1: Get user profile
    let userProfile = await User.findOne({ _id: DEMO_USER_ID }).lean();
    if (!userProfile) {
      // Create demo user if doesn't exist
      userProfile = await User.create({
        _id: DEMO_USER_ID,
        fullName: "Alex Chen",
        email: "alex.chen@mail.utoronto.ca",
        phone: "+1-416-555-0123",
        location: "Toronto, ON",
        summary: "Computer science student specializing in ML and AI with strong research and development background"
      });
      userProfile = userProfile.toObject();
    }

    // Step 2: Get all Identity Vault data
    const [existingEducation, existingExperience, existingProjects, existingSkills, existingAwards] = await Promise.all([
      EducationEntry.find({ userId: DEMO_USER_ID }).lean(),
      ExperienceEntry.find({ userId: DEMO_USER_ID }).lean(),
      ProjectEntry.find({ userId: DEMO_USER_ID }).lean(),
      SkillEntry.find({ userId: DEMO_USER_ID }).lean(),
      AwardEntry.find({ userId: DEMO_USER_ID }).lean()
    ]);

    const vaultData = {
      education: existingEducation,
      experience: existingExperience,
      projects: existingProjects,
      skills: existingSkills,
      awards: existingAwards
    };

    // Step 3: Generate resume generation prompt
    console.log(`[Resume Generation] Generating prompt...`);
    const resumePrompt = getResumeGenerationPrompt(jobDescription, userProfile, vaultData);

    // Step 4: Call AI to generate resume
    console.log(`[Resume Generation] Calling AI for resume generation... (this may take 3-5 seconds)`);
    const resumeData = await callGeminiJSON(resumePrompt);

    console.log(`[Resume Generation] Resume generated successfully`);

    sendSuccess(res, {
      message: "Resume generated successfully",
      resume: resumeData
    });
  } catch (error) {
    console.error("[Resume Generation] Error:", error);
    sendError(res, `Failed to generate resume: ${error.message}`, 500);
  }
});

// --------------------------------------------
// INTERVIEW PREP ENDPOINTS
// --------------------------------------------

// POST start interview session
app.post("/api/interview/start", async (req, res) => {
  try {
    const { company, position, requirements } = req.body;

    if (!company || !position || !requirements) {
      return sendError(res, "Missing required fields: company, position, requirements", 400);
    }

    const jobDescription = {
      company: company.trim(),
      position: position.trim(),
      requirements: requirements.trim()
    };

    console.log(`[Interview] Starting interview session for: ${position} at ${company}`);

    // Get user profile and vault data
    let userProfile = await User.findOne({ _id: DEMO_USER_ID }).lean();
    if (!userProfile) {
      userProfile = await User.create({
        _id: DEMO_USER_ID,
        fullName: "Alex Chen",
        email: "alex.chen@mail.utoronto.ca",
        phone: "+1-416-555-0123",
        location: "Toronto, ON",
        summary: "Computer science student specializing in ML and AI with strong research and development background"
      });
      userProfile = userProfile.toObject();
    }

    const [existingEducation, existingExperience, existingProjects, existingSkills, existingAwards] = await Promise.all([
      EducationEntry.find({ userId: DEMO_USER_ID }).lean(),
      ExperienceEntry.find({ userId: DEMO_USER_ID }).lean(),
      ProjectEntry.find({ userId: DEMO_USER_ID }).lean(),
      SkillEntry.find({ userId: DEMO_USER_ID }).lean(),
      AwardEntry.find({ userId: DEMO_USER_ID }).lean()
    ]);

    const vaultData = {
      education: existingEducation,
      experience: existingExperience,
      projects: existingProjects,
      skills: existingSkills,
      awards: existingAwards
    };

    // Generate first question
    const questionPrompt = getInterviewQuestionPrompt(jobDescription, userProfile, vaultData, [], 1);
    const questionResponse = await callGeminiJSON(questionPrompt);

    // Create session
    const sessionId = `session_${nextSessionId++}_${Date.now()}`;
    const session = {
      sessionId,
      userId: DEMO_USER_ID,
      jobDescription,
      userProfile,
      vaultData,
      status: "active",
      startedAt: new Date(),
      conversation: [
        {
          role: "interviewer",
          content: questionResponse.question,
          timestamp: new Date(),
          type: questionResponse.type || "mixed"
        }
      ],
      questionNumber: 1
    };

    interviewSessions.set(sessionId, session);

    console.log(`[Interview] Session created: ${sessionId}`);

    sendSuccess(res, {
      sessionId,
      question: questionResponse.question,
      type: questionResponse.type || "mixed",
      hint: questionResponse.hint || null
    });
  } catch (error) {
    console.error("[Interview] Error starting session:", error);
    sendError(res, `Failed to start interview: ${error.message}`, 500);
  }
});

// POST send message and get next question
app.post("/api/interview/message", async (req, res) => {
  try {
    const { sessionId, userResponse } = req.body;

    if (!sessionId || !userResponse) {
      return sendError(res, "Missing required fields: sessionId, userResponse", 400);
    }

    // Get session
    const session = interviewSessions.get(sessionId);
    if (!session) {
      return sendError(res, "Interview session not found", 404);
    }

    if (session.status !== "active") {
      return sendError(res, "Interview session is not active", 400);
    }

    console.log(`[Interview] Processing message for session: ${sessionId}`);

    // Add user response to conversation
    session.conversation.push({
      role: "user",
      content: userResponse.trim(),
      timestamp: new Date()
    });

    // Generate next question
    const nextQuestionNumber = session.questionNumber + 1;
    const questionPrompt = getInterviewQuestionPrompt(
      session.jobDescription,
      session.userProfile,
      session.vaultData,
      session.conversation,
      nextQuestionNumber
    );

    const questionResponse = await callGeminiJSON(questionPrompt);

    // Add interviewer question to conversation
    session.conversation.push({
      role: "interviewer",
      content: questionResponse.question,
      timestamp: new Date(),
      type: questionResponse.type || "mixed"
    });

    session.questionNumber = nextQuestionNumber;
    interviewSessions.set(sessionId, session);

    console.log(`[Interview] Generated question #${nextQuestionNumber} for session: ${sessionId}`);

    sendSuccess(res, {
      question: questionResponse.question,
      type: questionResponse.type || "mixed",
      hint: questionResponse.hint || null,
      questionNumber: nextQuestionNumber
    });
  } catch (error) {
    console.error("[Interview] Error processing message:", error);
    sendError(res, `Failed to process message: ${error.message}`, 500);
  }
});

// POST end interview and get feedback
app.post("/api/interview/end", async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return sendError(res, "Missing required field: sessionId", 400);
    }

    // Get session
    const session = interviewSessions.get(sessionId);
    if (!session) {
      return sendError(res, "Interview session not found", 404);
    }

    console.log(`[Interview] Ending session: ${sessionId}`);

    // Generate feedback
    const feedbackPrompt = getInterviewFeedbackPrompt(
      session.conversation,
      session.jobDescription,
      session.userProfile
    );

    const feedback = await callGeminiJSON(feedbackPrompt);

    // Update session
    session.status = "completed";
    session.endedAt = new Date();
    session.finalFeedback = feedback;
    interviewSessions.set(sessionId, session);

    console.log(`[Interview] Session ended. Overall score: ${feedback.overallScore}`);

    sendSuccess(res, {
      feedback,
      transcript: session.conversation
    });
  } catch (error) {
    console.error("[Interview] Error ending session:", error);
    sendError(res, `Failed to end interview: ${error.message}`, 500);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});