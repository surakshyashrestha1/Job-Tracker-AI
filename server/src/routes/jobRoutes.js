import express from "express";
import mongoose from "mongoose";
import { z } from "zod";

import Application from "../models/Application.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

// All job APIs require login
router.use(requireAuth);

// Allowed fields and values
const jobFields = {
  company: z.string().trim().min(2).max(100),
  role: z.string().trim().min(2).max(100),
  status: z.enum(["Saved", "Applied", "Interview", "Offer", "Rejected"]),
};

const createSchema = z
  .object({
    company: jobFields.company,
    role: jobFields.role,
    status: jobFields.status.default("Saved"),
  })
  .strict();

const updateSchema = z
  .object({
    company: jobFields.company.optional(),
    role: jobFields.role.optional(),
    status: jobFields.status.optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field is required",
  );

// READ — Logged-in user's jobs only
router.get("/", async (req, res, next) => {
  try {
    const jobs = await Application.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    next(error);
  }
});

// CREATE — Add job for current user
router.post("/", async (req, res, next) => {
  try {
    const result = createSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid job information",
      });
    }

    const job = await Application.create({
      ...result.data,
      user: req.user.id,
    });

    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
});

// UPDATE — Edit user's own job
router.patch("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid job ID",
      });
    }

    const result = updateSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid update information",
      });
    }

    const job = await Application.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      { $set: result.data },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.json(job);
  } catch (error) {
    next(error);
  }
});

// DELETE — Delete user's own job
router.delete("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid job ID",
      });
    }

    const job = await Application.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
