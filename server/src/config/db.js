import mongoose from "mongoose";
import dns from "node:dns";

// Local development DNS workaround
if (process.env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

export async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB connected successfully!");
}
