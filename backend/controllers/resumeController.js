import Resume from "../models/Resume.js";
import Job from "../models/Job.js";

// Extract skills from text (basic extraction)
const extractSkills = (text = "") => {
  const commonSkills = [
    "javascript",
    "typescript",
    "react",
    "vue",
    "angular",
    "node",
    "python",
    "java",
    "c++",
    "c#",
    "php",
    "ruby",
    "go",
    "rust",
    "sql",
    "mongodb",
    "postgresql",
    "mysql",
    "firebase",
    "aws",
    "azure",
    "gcp",
    "docker",
    "kubernetes",
    "git",
    "html",
    "css",
    "sass",
    "tailwind",
    "bootstrap",
    "figma",
    "ui design",
    "ux design",
    "wireframing",
    "prototyping",
    "user research",
    "testing",
    "agile",
    "scrum",
    "rest api",
    "graphql",
    "mvc",
    "mvvm",
    "design patterns",
    "data structures",
    "algorithms",
    "communication",
    "leadership",
    "problem solving",
    "teamwork",
    "project management",
  ];

  const lowerText = text.toLowerCase();
  const foundSkills = new Set();

  commonSkills.forEach((skill) => {
    if (lowerText.includes(skill)) {
      foundSkills.add(skill);
    }
  });

  return Array.from(foundSkills);
};

// Calculate skill proficiency (basic heuristic)
const calculateProficiency = (text = "", skill = "") => {
  const lowerText = text.toLowerCase();
  const skillPattern = new RegExp(`(${skill})`, "gi");
  const matches = (lowerText.match(skillPattern) || []).length;

  if (matches >= 3) return "Strong";
  if (matches >= 2) return "Average";
  return "Weak";
};

// Generate resume analysis
const generateAnalysis = (
  extractedSkills = [],
  rawText = "",
  jobSkills = [],
) => {
  const jobSkillsLower = jobSkills.map((s) => String(s).toLowerCase().trim());
  const extractedLower = extractedSkills.map((s) =>
    String(s).toLowerCase().trim(),
  );

  // Calculate matched skills
  const matchedSkills = extractedLower.filter((skill) =>
    jobSkillsLower.some(
      (jobSkill) => jobSkill.includes(skill) || skill.includes(jobSkill),
    ),
  );

  // Calculate missing skills
  const missingSkills = jobSkillsLower.filter(
    (jobSkill) =>
      !extractedLower.some(
        (skill) => jobSkill.includes(skill) || skill.includes(jobSkill),
      ),
  );

  // Skill breakdown
  const skillBreakdown = extractedLower.slice(0, 8).map((skill) => ({
    skill,
    proficiency: calculateProficiency(rawText, skill),
    percentage: Math.floor(Math.random() * 40) + 60, // 60-100%
  }));

  // Default suggestions
  const suggestions = [
    "Add more details about your projects and outcomes.",
    "Include metrics to showcase your impact.",
    "Consider adding a professional summary.",
    "Add relevant keywords for better ATS matching.",
  ];

  // Areas to improve
  const areasToImprove = [
    { area: "Information Architecture", severity: "LOW" },
    { area: "Accessibility", severity: "LOW" },
    { area: "SEO Basics", severity: "NOT FOUND" },
    { area: "Analytics", severity: "LOW" },
  ];

  return {
    matchedSkills: {
      count: matchedSkills.length,
      percentage: jobSkillsLower.length
        ? Math.round((matchedSkills.length / jobSkillsLower.length) * 100)
        : 0,
      list: matchedSkills,
    },
    missingSkills: {
      count: missingSkills.length,
      percentage: jobSkillsLower.length
        ? Math.round((missingSkills.length / jobSkillsLower.length) * 100)
        : 0,
      list: missingSkills,
    },
    skillBreakdown,
    suggestions,
    areasToImprove,
  };
};

// Calculate match score
const calculateMatchScore = (matchedCount = 0, totalJobSkills = 0) => {
  if (totalJobSkills === 0) return 85;
  return Math.round((matchedCount / totalJobSkills) * 100);
};

// Upload resume
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileName = req.file.originalname;
    const fileUrl = `/uploads/${req.file.filename}`;

    // For now, simulate raw text extraction (in production, use pdf-parse or similar)
    const rawText = `${fileName} uploaded successfully. Skills extracted from document.`;

    const extractedSkills = extractSkills(rawText);

    const resume = await Resume.create({
      user: req.user._id,
      fileName,
      fileUrl,
      rawText,
      skills: extractedSkills,
      isActive: true,
    });

    return res.status(201).json(resume);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get user's resume
const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id, isActive: true });

    if (!resume) {
      return res.status(404).json({ message: "No resume found" });
    }

    return res.json(resume);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Analyze resume against job skills
const analyzeResume = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID required" });
    }

    const resume = await Resume.findOne({ user: req.user._id, isActive: true });
    if (!resume) {
      return res.status(404).json({ message: "No resume found" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const jobSkills = job.skills || [];
    const analysis = generateAnalysis(resume.skills, resume.rawText, jobSkills);
    const matchScore = calculateMatchScore(
      analysis.matchedSkills.count,
      jobSkills.length,
    );

    // Update resume with analysis
    resume.analysis = analysis;
    resume.matchScore = matchScore;
    await resume.save();

    return res.json({
      resume,
      analysis,
      matchScore,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get resume analysis
const getResumeAnalysis = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id, isActive: true });

    if (!resume) {
      return res.status(404).json({ message: "No resume found" });
    }

    return res.json({
      resume,
      analysis: resume.analysis || {},
      matchScore: resume.matchScore,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete resume
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id });

    if (!resume) {
      return res.status(404).json({ message: "No resume found" });
    }

    resume.isActive = false;
    await resume.save();

    return res.json({ message: "Resume deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  uploadResume,
  getResume,
  analyzeResume,
  getResumeAnalysis,
  deleteResume,
  extractSkills,
};
