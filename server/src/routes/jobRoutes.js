import express from "express";
import mongoose from "mongoose";
import { z } from "zod";
import Application from "../models/Application.js";

const router = express.Router();

const jobSchema = z
  .object({
    company: z.string().trim().min(2),
    role: z.string().trim().min(2),
    status: z
      .enum(["Saved", "Applied", "Interview", "Offer", "Rejected"])
      .default("Saved"),
  })
  .strict();

const updateSchema = z
  .object({
    company: z.string().trim().min(2).optional(),
    role: z.string().trim().min(2).optional(),
    status: z
      .enum(["Saved", "Applied", "Interview", "Offer", "Rejected"])
      .optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0);

// GET — Read all jobs
router.get("/", async (req, res, next) => {
  try {
    const jobs = await Application.find().sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    next(error);
  }
});

// POST — Add new job
router.post("/", async (req, res, next) => {
  try {
    const result = jobSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid job information",
      });
    }

    const job = await Application.create(result.data);

    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
});

// PATCH — Update job
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

    const job = await Application.findByIdAndUpdate(
      req.params.id,
      result.data,
      { new: true, runValidators: true },
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

// DELETE — Remove job
router.delete("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid job ID",
      });
    }

    const job = await Application.findByIdAndDelete(req.params.id);

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
