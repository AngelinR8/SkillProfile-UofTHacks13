import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
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
  linkedInUrl: { 
    type: String,
    trim: true
  },
  githubUrl: { 
    type: String,
    trim: true
  },
  personalWebsite: { 
    type: String,
    trim: true
  },
  summary: { 
    type: String,
    trim: true
  }
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt fields
});

export default mongoose.model("User", UserSchema);
