import express from "express";
import {
  createApplication,
  getMyApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/jobs/:jobId/apply", protect, createApplication);
router.get("/my", protect, getMyApplications);
router.patch("/:id/status", protect, updateApplicationStatus);

export default router;
