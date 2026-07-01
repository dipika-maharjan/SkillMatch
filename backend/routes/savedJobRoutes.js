import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  saveJob,
  unsaveJob,
  getSavedJobs,
  getSavedJobIds,
} from "../controllers/savedJobController.js";

const router = express.Router();

router.post("/:jobId", protect, saveJob);
router.delete("/:jobId", protect, unsaveJob);
router.get("/", protect, getSavedJobs);
router.get("/ids", protect, getSavedJobIds);

export default router;
