import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
} from "../controllers/jobController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getJobs);
router.post("/", protect, createJob);
router.get("/:id", protect, getJobById);

export default router;
