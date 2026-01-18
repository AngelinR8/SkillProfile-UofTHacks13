import mongoose from "mongoose";

const ProgressUpdateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  rawText: {
    type: String,
    required: true,
    trim: true  // The user's natural language description
  },
  processedAt: {
    type: Date,
    default: null  // When AI processing completed
  },
  extractedEntities: {
    education: {
      type: mongoose.Schema.Types.Mixed  // Partial EducationEntry structure
    },
    experience: {
      type: mongoose.Schema.Types.Mixed  // Partial ExperienceEntry structure
    },
    project: {
      type: mongoose.Schema.Types.Mixed  // Partial ProjectEntry structure
    },
    award: {
      type: mongoose.Schema.Types.Mixed  // Partial AwardEntry structure
    },
    skills: [{
      type: String  // Skill names extracted
    }]
  },
  aiEnhancement: {
    polishedEducation: {
      type: mongoose.Schema.Types.Mixed
    },
    polishedExperience: {
      type: mongoose.Schema.Types.Mixed
    },
    polishedProject: {
      type: mongoose.Schema.Types.Mixed
    },
    polishedAward: {
      type: mongoose.Schema.Types.Mixed
    },
    identifiedSkills: [{
      type: String
    }]
  }
}, {
  timestamps: true
});

export default mongoose.model("ProgressUpdate", ProgressUpdateSchema);
