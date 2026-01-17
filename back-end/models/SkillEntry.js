import mongoose from "mongoose";

const SkillEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true  // e.g., "React", "Python", "Project Management"
  },
  category: {
    type: String,
    enum: ["programming", "framework", "tool", "language", "soft-skill", "other"],
    required: true
  },
  proficiency: {
    type: String,
    enum: ["beginner", "intermediate", "advanced", "expert"],
    required: true
  },
  yearsOfExperience: {
    type: Number,
    min: 0
  },
  verifiedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "ExperienceEntry"  // References to experiences/education that validate this skill
  }],
  tags: [{
    type: String,
    trim: true  // Additional categorization
  }]
}, {
  timestamps: true
});

export default mongoose.model("SkillEntry", SkillEntrySchema);
