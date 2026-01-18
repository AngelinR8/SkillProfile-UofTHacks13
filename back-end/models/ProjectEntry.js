import mongoose from "mongoose";

const ProjectEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true  // Project name
  },
  description: {
    type: String,
    trim: true  // Overall project description
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    default: null  // null if ongoing project
  },
  bullets: [{
    type: String,
    trim: true  // Array of AI-enhanced bullet points describing the project
  }],
  technologies: [{
    type: String,
    trim: true  // Technologies used (e.g., "React", "Node.js", "MongoDB")
  }],
  skills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "SkillEntry"
  }],
  url: {
    type: String,
    trim: true  // Project URL (GitHub, demo, etc.)
  },
  achievements: [{
    type: String,
    trim: true  // Notable achievements or outcomes
  }],
  tags: [{
    type: String,
    trim: true  // For categorization (e.g., "web", "mobile", "ai")
  }]
}, {
  timestamps: true
});

export default mongoose.model("ProjectEntry", ProjectEntrySchema);
