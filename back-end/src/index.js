import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

// Import all models
import User from "../models/User.js";
import EducationEntry from "../models/EducationEntry.js";
import ExperienceEntry from "../models/ExperienceEntry.js";
import SkillEntry from "../models/SkillEntry.js";
import ProgressUpdate from "../models/ProgressUpdate.js";

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Allow frontend to access this API
app.use(express.json()); // Parse JSON request bodies

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
        email: "demo@example.com",
        fullName: "Demo User"
      });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update user profile
app.put("/api/user/profile", async (req, res) => {
  try {
    let user = await User.findOne();
    if (!user) {
      user = await User.create(req.body);
    } else {
      user = await User.findByIdAndUpdate(user._id, req.body, { new: true });
    }
    res.json({ status: "success", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --------------------------------------------
// EDUCATION ENDPOINTS
// --------------------------------------------

// GET all education entries
app.get("/api/education", async (req, res) => {
  try {
    const education = await EducationEntry.find({ userId: DEMO_USER_ID }).sort({ startDate: -1 });
    res.json({ education });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create education entry
app.post("/api/education", async (req, res) => {
  try {
    const educationData = {
      ...req.body,
      userId: DEMO_USER_ID
    };
    const education = await EducationEntry.create(educationData);
    res.status(201).json({ status: "success", education });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
      return res.status(404).json({ error: "Education entry not found" });
    }
    res.json({ status: "success", education });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE education entry
app.delete("/api/education/:id", async (req, res) => {
  try {
    const education = await EducationEntry.findByIdAndDelete(req.params.id);
    if (!education) {
      return res.status(404).json({ error: "Education entry not found" });
    }
    res.json({ status: "success", message: "Education entry deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    res.json({ experiences });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create experience entry
app.post("/api/experience", async (req, res) => {
  try {
    const experienceData = {
      ...req.body,
      userId: DEMO_USER_ID
    };
    const experience = await ExperienceEntry.create(experienceData);
    res.status(201).json({ status: "success", experience });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
      return res.status(404).json({ error: "Experience entry not found" });
    }
    res.json({ status: "success", experience });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE experience entry
app.delete("/api/experience/:id", async (req, res) => {
  try {
    const experience = await ExperienceEntry.findByIdAndDelete(req.params.id);
    if (!experience) {
      return res.status(404).json({ error: "Experience entry not found" });
    }
    res.json({ status: "success", message: "Experience entry deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --------------------------------------------
// SKILLS ENDPOINTS
// --------------------------------------------

// GET all skill entries
app.get("/api/skills", async (req, res) => {
  try {
    const skills = await SkillEntry.find({ userId: DEMO_USER_ID }).sort({ name: 1 });
    res.json({ skills });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create skill entry
app.post("/api/skills", async (req, res) => {
  try {
    const skillData = {
      ...req.body,
      userId: DEMO_USER_ID
    };
    const skill = await SkillEntry.create(skillData);
    res.status(201).json({ status: "success", skill });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
      return res.status(404).json({ error: "Skill entry not found" });
    }
    res.json({ status: "success", skill });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE skill entry
app.delete("/api/skills/:id", async (req, res) => {
  try {
    const skill = await SkillEntry.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({ error: "Skill entry not found" });
    }
    res.json({ status: "success", message: "Skill entry deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});