import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

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

// ============================================
// IDENTITY VAULT API ENDPOINTS
// ============================================

// For demo purposes, we'll use a hardcoded userId
// In production, this would come from authentication
const DEMO_USER_ID = "65f1234567890abcdef12345"; // Replace with actual user ID in production

// --------------------------------------------
// USER PROFILE ENDPOINTS
// --------------------------------------------

// GET user profile
app.get("/api/user/profile", async (req, res) => {
  try {
    // For demo, get first user or create one
    let user = await User.findOne();
    if (!user) {
      user = await User.create({
        fullName: "Alex Chen",
        summary: "Computer Science student passionate about full-stack development"
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
    let user = await User.findOne();
    if (!user) {
      user = await User.create(req.body);
    } else {
      user = await User.findByIdAndUpdate(user._id, req.body, { new: true, runValidators: true });
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});