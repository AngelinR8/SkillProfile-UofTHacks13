import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  // Since we're not implementing login, email is optional
  email: { 
    type: String, 
    trim: true,
    lowercase: true
  },
  fullName: { 
    type: String, 
    required: true,
    trim: true
  },
  phone: { 
    type: String,
    trim: true
  },
  location: { 
    type: String,
    trim: true
  },
  // Links stored as array for flexibility
  links: [{
    platform: {
      type: String,
      enum: ["linkedin", "github", "twitter", "personal", "other"],
      required: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    }
  }],
  summary: { 
    type: String,
    trim: true  // Brief professional summary/bio
  }
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt fields
});

export default mongoose.model("User", UserSchema);
