import mongoose from "mongoose";

const EducationEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  institution: {
    type: String,
    required: true,
    trim: true
  },
  degree: {
    type: String,
    required: true,
    trim: true  // e.g., "Bachelor of Science", "Master of Engineering"
  },
  fieldOfStudy: {
    type: String,
    required: true,
    trim: true  // e.g., "Computer Science", "Software Engineering"
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    default: null  // null if currently enrolled
  },
  gpa: {
    type: Number,
    min: 0,
    max: 4.0
  },
  description: {
    type: String,
    trim: true  // AI-enhanced description
  },
  achievements: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true  // e.g., "undergraduate", "technical"
  }]
}, {
  timestamps: true
});

export default mongoose.model("EducationEntry", EducationEntrySchema);
