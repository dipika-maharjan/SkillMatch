import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Resume from "../models/Resume.js";

const normalizeSkills = (skills = []) => {
  return (skills || [])
    .map((skill) => String(skill).toLowerCase().trim())
    .filter(Boolean);
};

const calculateMatchScore = (
  jobSkills = [],
  userSkills = [],
  resumeText = "",
) => {
  const jobSkillSet = new Set(normalizeSkills(jobSkills));
  const userSkillSet = new Set(normalizeSkills(userSkills));
  const resumeLower = String(resumeText).toLowerCase();

  if (!jobSkillSet.size) return 0;

  const overlap = [...jobSkillSet].filter((skill) =>
    userSkillSet.has(skill),
  ).length;
  let score = Math.round((overlap / jobSkillSet.size) * 100);

  const resumeMatches = [...jobSkillSet].filter((skill) =>
    resumeLower.includes(skill),
  ).length;
  score = Math.min(
    100,
    score + Math.round((resumeMatches / Math.max(jobSkillSet.size, 1)) * 20),
  );

  if (score < 50 && userSkillSet.size > 0) {
    score = Math.min(100, score + 5);
  }

  return Math.max(0, Math.min(100, score));
};

const createApplication = async (req, res) => {
  try {
    const { jobId } = req.params;
    const {
      coverLetter = "",
      resumeUrl = "",
      userSkills = [],
      resumeText = "",
    } = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const existingApplication = await Application.findOne({
      user: req.user._id,
      job: job._id,
    });

    if (existingApplication) {
      return res
        .status(409)
        .json({ message: "You already applied to this job" });
    }

    const storedResume = await Resume.findOne({
      user: req.user._id,
      isActive: true,
    }).sort({
      uploadedAt: -1,
    });

    const effectiveResumeUrl = resumeUrl || storedResume?.fileUrl || "";
    const effectiveUserSkills = userSkills.length
      ? userSkills
      : storedResume?.skills || [];
    const effectiveResumeText = resumeText || storedResume?.rawText || "";

    const matchScore = calculateMatchScore(
      job.skills || [],
      effectiveUserSkills,
      effectiveResumeText,
    );

    const application = await Application.create({
      user: req.user._id,
      job: job._id,
      company: job.company,
      jobTitle: job.title,
      coverLetter,
      resumeUrl: effectiveResumeUrl,
      matchScore,
    });

    return res.status(201).json(application);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .sort({ appliedAt: -1 })
      .populate("job");

    return res.json(applications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (
      application.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const allowedStatuses = [
      "Applied",
      "Reviewed",
      "Interview",
      "Rejected",
      "Accepted",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    application.status = status;
    await application.save();

    return res.json(application);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { createApplication, getMyApplications, updateApplicationStatus };
