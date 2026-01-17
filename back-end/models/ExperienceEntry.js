import mongoose from "mongoose";

const ExperienceEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    trim: true  // null for personal projects
  },
  location: {
    type: String,
    trim: true
  },
  employmentType: {
    type: String,
    enum: ["full-time", "part-time", "contract", "internship", "freelance", "project"],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    default: null  // null if current position
  },
  bullets: [{
    type: String,
    trim: true  // Array of AI-enhanced bullet points
  }],
  skills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "SkillEntry"
  }],
  description: {
    type: String,
    trim: true  // Overall role description
  },
  achievements: [{
    type: String,
    trim: true  // Quantifiable achievements
  }],
  tags: [{
    type: String,
    trim: true  // e.g., "leadership", "technical", "frontend"
  }]
}, {
  timestamps: true
});

export default mongoose.model("ExperienceEntry", ExperienceEntrySchema);
