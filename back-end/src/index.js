import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

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

import Skill from "../models/Skill.js";

// GET all skills
app.get("/api/skills", async (req, res) => {
  const skills = await Skill.find();
  res.json(skills);
});

// POST new skill
app.post("/api/skills", async (req, res) => {
  const { skill } = req.body;
  const newSkill = new Skill({ name: skill });
  await newSkill.save();
  res.json({ status: "ok", skill: newSkill });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});