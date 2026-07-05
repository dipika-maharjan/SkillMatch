import express from "express";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Middleware to check if user is admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

const parseSalary = (salary = "") => {
  const numbers = String(salary).match(/\d+/g) || [];
  return {
    salaryMin: Number(numbers[0] || 0),
    salaryMax: Number(numbers[1] || numbers[0] || 0),
  };
};

const normalizeJobPayload = (body) => {
  const {
    title,
    company,
    location,
    salary,
    description,
    requirements,
    type,
    status,
    category,
    experienceLevel,
    jobImage,
    companyLogo,
    companyWebsite,
    companySize,
    companyDescription,
  } = body;
  const { salaryMin, salaryMax } = parseSalary(salary);

  return {
    title,
    company,
    location,
    description,
    skills: requirements
      ? requirements.split("\n").map((item) => item.trim()).filter(Boolean)
      : [],
    workType: type,
    experienceLevel,
    salaryMin,
    salaryMax,
    isActive: status === "active",
    category: category || "General",
    jobImage,
    companyLogo,
    companyWebsite,
    companySize,
    companyDescription,
  };
};

// Apply auth middleware to all admin routes
router.use(protect);
router.use(adminOnly);

// ==================== DASHBOARD STATS ====================

router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeJobs = await Job.countDocuments({ isActive: true });
    const totalApplications = await Application.countDocuments();
    const placements = await Application.countDocuments({ status: "accepted" });

    // Recent activity
    const recentActivity = await Application.find()
      .populate("user", "fullname")
      .sort({ createdAt: -1 })
      .limit(5)
      .select("user jobTitle status createdAt");

    const activity = recentActivity.map((app) => ({
      title: `New application from ${app.user?.fullname || "Unknown User"}`,
      description: `Applied for ${app.jobTitle}`,
      type: "application",
      timestamp: new Date(app.createdAt).toLocaleDateString(),
    }));

    res.status(200).json({
      totalUsers,
      activeJobs,
      totalApplications,
      placements,
      usersTrend: 12,
      jobsTrend: 8,
      applicationsTrend: 15,
      placementsTrend: 5,
      recentActivity: activity,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== JOB MANAGEMENT ====================

router.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .select(
        "title company location isActive createdAt description skills workType experienceLevel category salaryMin salaryMax jobImage companyLogo companyWebsite companySize companyDescription",
      );

    // Count applications for each job
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const appCount = await Application.countDocuments({ job: job._id });
        return {
          ...job.toObject(),
          status: job.isActive ? "active" : "expired",
          applications: appCount,
        };
      }),
    );

    res.status(200).json(jobsWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/jobs", async (req, res) => {
  try {
    const newJob = new Job(normalizeJobPayload(req.body));

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      normalizeJobPayload(req.body),
      { new: true },
    );

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/jobs/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== APPLICATION MANAGEMENT ====================

router.get("/applications", async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("user", "fullname email phone location")
      .populate("job", "title company location")
      .sort({ appliedAt: -1 });

    const formattedApps = applications.map((app) => ({
      _id: app._id,
      candidateName: app.user?.fullname,
      candidateEmail: app.user?.email,
      candidatePhone: app.user?.phone,
      candidateLocation: app.user?.location,
      jobTitle: app.jobTitle,
      company: app.company,
      jobLocation: app.job?.location,
      status: app.status,
      coverLetter: app.coverLetter,
      resume: app.resumeUrl,
      createdAt: app.appliedAt,
    }));

    res.status(200).json(formattedApps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/applications/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    // Create notification for user
    if (application) {
      const statusTitle =
        status === "accepted"
          ? "Application Accepted"
          : status === "rejected"
            ? "Application Rejected"
            : "Application Status Updated";

      const statusMessage =
        status === "accepted"
          ? "Your application has been accepted!"
          : status === "rejected"
            ? "Your application has been rejected."
            : "Your application status has been updated.";

      await Notification.create({
        user: application.user,
        title: statusTitle,
        message: statusMessage,
        type: "application_update",
        actionUrl: `/applications`,
        metadata: {
          applicationId: application._id,
          jobTitle: application.jobTitle,
        },
      });
    }

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/applications/:id", async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== USER MANAGEMENT ====================

router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true },
    ).select("-password");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== ANALYTICS ====================

router.get("/analytics", async (req, res) => {
  try {
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const dailyApplications = await Application.aggregate([
      {
        $match: {
          createdAt: { $gte: last30Days },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const jobsByCategory = await Job.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const applicationsByStatus = await Application.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      dailyApplications,
      jobsByCategory,
      applicationsByStatus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
