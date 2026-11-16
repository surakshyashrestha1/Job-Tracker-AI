import "dotenv/config";
import express from "express";

import { connectDB } from "./config/db.js";
import jobRoutes from "./routes/jobRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to JobTracker AI Backend!");
});

// Health API
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "JobTracker Backend is Working!",
  });
});

// MongoDB CRUD routes
app.use("/api/jobs", jobRoutes);

// Error handler
app.use((error, req, res, next) => {
  console.error(error.message);

  res.status(500).json({
    message: "Internal server error",
  });
});

// Connect database before starting server
async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Backend running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);

    process.exit(1);
  }
}

startServer();
