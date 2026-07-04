import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env relative to this file.
dotenv.config({ path: path.join(__dirname, ".env") });

import cors from "cors";
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import savedJobRoutes from "./routes/savedJobRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import fs from "fs";

// Ensure uploads directories exist
const uploadsDir = path.join(__dirname, "./uploads");
const avatarsDir = path.join(uploadsDir, "avatars");
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
  console.log("Created uploads/avatars directory");
}

connectDB();

const app = express();

// Middleware
app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Static file serving for uploads - with error logging
app.use(
  "/uploads",
  (req, res, next) => {
    next();
  },
  express.static(path.join(__dirname, "./uploads"), {
    maxAge: 0, // No caching to ensure fresh files
    setHeaders: (res, filePath) => {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    },
  }),
);

// Routes
app.get("/", (req, res) => {
  res.send("SkillMatch API Running");
});

// Test file serving
app.get("/test-file-serve", (req, res) => {
  const testPath = path.join(__dirname, "./uploads/avatars");
  try {
    const files = fs.readdirSync(testPath);
    const fileDetails = files.map((file) => {
      const fullPath = path.join(testPath, file);
      const stats = fs.statSync(fullPath);
      return {
        name: file,
        size: stats.size,
        mtime: stats.mtime,
        isFile: stats.isFile(),
      };
    });
    res.json({
      directoryPath: testPath,
      filesInDirectory: fileDetails,
      count: files.length,
      uploadsDirExists: fs.existsSync(path.join(__dirname, "./uploads")),
      avatarsDirExists: fs.existsSync(testPath),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/test-serve-file/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "./uploads/avatars", filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found", path: filePath });
  }

  try {
    const stats = fs.statSync(filePath);
    res.json({
      filename,
      path: filePath,
      size: stats.size,
      exists: true,
      message: "File can be served from this path",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Direct file serving endpoint (bypass static middleware for debugging)
app.get("/serve-avatar/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "./uploads/avatars", filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found", path: filePath });
  }

  try {
    const stat = fs.statSync(filePath);
    const mimeType = "image/jpeg"; // Default to jpeg

    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Length", stat.size);
    res.setHeader("Cache-Control", "public, max-age=3600");

    const stream = fs.createReadStream(filePath);
    stream.on("error", (err) => {
      console.error("Stream error:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: err.message });
      }
    });

    stream.pipe(res);
  } catch (err) {
    console.error("Serve error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/test", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/saved-jobs", savedJobRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
