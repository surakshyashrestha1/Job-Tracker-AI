import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

import { connectDB } from "./config/db.js";
import jobRoutes from "./routes/jobRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());

// Limit repeated authentication requests
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to JobTracker AI Backend!");
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "JobTracker Backend is Working!",
  });
});

// Register / Login / Logout APIs
app.use("/api/auth", authLimiter, authRoutes);

// Protected job CRUD routes
// Authentication and ownership checks are in jobRoutes.js
app.use("/api/jobs", jobRoutes);

// Error handler
app.use((error, req, res, next) => {
  console.error("Server error:", error.message);

  res.status(500).json({
    message: "Internal server error",
  });
});

// Start only after MongoDB connects
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
