import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));
console.log("MONGO_URI:", process.env.MONGO_URI);
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Example GET endpoint
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// Example POST endpoint
app.post("/api/data", (req, res) => {
  const received = req.body;
  console.log("Received from frontend:", received);

  res.json({ status: "ok", received });
});

// ⭐ Add your root route RIGHT HERE
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Import all models
import User from "../models/User.js";
import EducationEntry from "../models/EducationEntry.js";
import ExperienceEntry from "../models/ExperienceEntry.js";
import SkillEntry from "../models/SkillEntry.js";
import ProgressUpdate from "../models/ProgressUpdate.js";

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});