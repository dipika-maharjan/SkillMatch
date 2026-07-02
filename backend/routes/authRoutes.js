import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
  getSettings,
  updateSettings,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/avatars");
    console.log("Multer destination:", uploadDir);

    // Ensure directory exists (synchronously)
    try {
      if (!fs.existsSync(uploadDir)) {
        console.log("Creating upload directory:", uploadDir);
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log("✅ Directory created");
      }
      cb(null, uploadDir);
    } catch (err) {
      console.error("❌ Failed to create directory:", err);
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = "avatar-" + uniqueSuffix + path.extname(file.originalname);
    console.log("Multer will save as:", filename);
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  console.log("Multer fileFilter - checking file:", {
    fieldname: file.fieldname,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
  });

  const allowedMimes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowedMimes.includes(file.mimetype)) {
    console.log("✅ File type accepted:", file.mimetype);
    cb(null, true);
  } else {
    console.log("❌ File type rejected:", file.mimetype);
    cb(new Error("Only image files (JPEG, PNG, JPG, WEBP) are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", protect, logoutUser);

router.post("/forgot-password", forgotPassword);

router.put("/reset-password/:token", resetPassword);

router.get("/profile", protect, getProfile);

router.post(
  "/upload-avatar",
  protect,
  (req, res, next) => {
    upload.single("avatar")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.error("Multer error:", err);
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(413)
            .json({ message: "File size exceeds 5MB limit" });
        }
        return res
          .status(400)
          .json({ message: `Upload error: ${err.message}` });
      } else if (err) {
        console.error("Upload error:", err);
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file) {
        console.error("❌ No file in req.file");
        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      console.log("✅ File received by multer:", {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype,
      });

      // Verify file actually exists on disk
      const fileExists = fs.existsSync(req.file.path);
      console.log("File exists on disk:", fileExists);

      if (!fileExists) {
        console.error("❌ File not on disk at:", req.file.path);
        return res.status(500).json({
          message: "File upload failed - file not saved to disk",
        });
      }

      console.log("✅ File verified on disk");

      // Update user's avatarUrl
      const avatarUrl = `/uploads/avatars/${req.file.filename}`;
      console.log("Setting avatar URL:", avatarUrl);

      req.user.avatarUrl = avatarUrl;
      await req.user.save();

      console.log("✅ User saved to database with avatar:", avatarUrl);

      const response = {
        message: "Avatar uploaded successfully",
        avatarUrl: avatarUrl,
        user: {
          _id: req.user._id,
          avatarUrl: avatarUrl,
        },
      };

      console.log("📤 Sending response:", response);
      res.json(response);
      console.log("✅ Response sent to client");
    } catch (error) {
      console.error("❌ Avatar upload handler error:", error);
      res.status(500).json({ message: error.message });
    }
  },
);

router.put("/profile", protect, updateProfile);

router.get("/settings", protect, getSettings);

router.put("/settings", protect, updateSettings);

router.put("/change-password", protect, changePassword);

export default router;
