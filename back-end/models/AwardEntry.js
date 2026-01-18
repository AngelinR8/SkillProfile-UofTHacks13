import mongoose from "mongoose";

const AwardEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true  // Award title (e.g., "Dean's List", "Best Hack")
  },
  issuer: {
    type: String,
    trim: true  // Organization/institution that issued the award
  },
  date: {
    type: Date,
    required: true  // When the award was received
  },
  description: {
    type: String,
    trim: true  // Description of the award and why it was received
  },
  category: {
    type: String,
    enum: ["academic", "professional", "competition", "recognition", "other"],
    default: "other"
  },
  tags: [{
    type: String,
    trim: true  // For categorization (e.g., "hackathon", "academic")
  }]
}, {
  timestamps: true
});

export default mongoose.model("AwardEntry", AwardEntrySchema);
