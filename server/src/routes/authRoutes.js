import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

import User from "../models/User.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

const cookieName = "jobtracker_token";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

// Validate register information
const registerSchema = z
  .object({
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().email(),
    password: z.string().min(10).max(72),
  })
  .strict();

// Validate login information
const loginSchema = z
  .object({
    email: z.string().trim().email(),
    password: z.string().min(1),
  })
  .strict();

// Generate JWT
function generateToken(user) {
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

// Save token inside cookie
function sendLoginCookie(res, user) {
  const token = generateToken(user);

  res.cookie(cookieName, token, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

// REGISTER
router.post("/register", async (req, res, next) => {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid registration information",
      });
    }

    const { name, password } = result.data;
    const email = result.data.email.toLowerCase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      passwordHash,
    });

    sendLoginCookie(res, user);

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    next(error);
  }
});

// LOGIN
router.post("/login", async (req, res, next) => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid login information",
      });
    }

    const email = result.data.email.toLowerCase();
    const password = result.data.password;

    const user = await User.findOne({ email }).select("+passwordHash");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    sendLoginCookie(res, user);

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
});

// CURRENT LOGGED-IN USER
router.get("/me", requireAuth, (req, res) => {
  res.json({
    user: req.user,
  });
});

// LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie(cookieName, cookieOptions);

  res.json({
    message: "Logout successful",
  });
});

export default router;
