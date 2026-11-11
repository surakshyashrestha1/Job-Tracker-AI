import express from "express";

const app = express();
const PORT = 5000;

app.use(express.json());

// Test backend
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "JobTracker Backend is Working!",
  });
});

// Sample job applications
const jobs = [
  {
    id: 1,
    company: "Demo Tech",
    role: "React Developer",
    status: "Applied",
  },
  {
    id: 2,
    company: "Example IT",
    role: "Backend Developer",
    status: "Interview",
  },
];

// Get all jobs
app.get("/api/jobs", (req, res) => {
  res.json(jobs);
});

// Start backend
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
