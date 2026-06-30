import Job from "../models/Job.js";

const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      workType,
      experienceLevel,
      category,
      salaryMin,
      salaryMax,
      description,
      skills,
      isActive,
    } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      workType,
      experienceLevel,
      category,
      salaryMin,
      salaryMax,
      description,
      skills,
      postedBy: req.user?._id,
      isActive: isActive ?? true,
    });

    return res.status(201).json(job);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getJobs = async (req, res) => {
  try {
    const {
      search,
      workType,
      experienceLevel,
      category,
      minSalary,
      maxSalary,
      page = 1,
      limit = 10,
    } = req.query;
    const filters = { isActive: true };

    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { skills: { $regex: search, $options: "i" } },
      ];
    }

    if (workType) {
      filters.workType = workType;
    }

    if (experienceLevel) {
      filters.experienceLevel = experienceLevel;
    }

    if (category) {
      filters.category = category;
    }

    if (minSalary) {
      filters.salaryMax = { $gte: Number(minSalary) };
    }

    if (maxSalary) {
      filters.salaryMin = { $lte: Number(maxSalary) };
    }

    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const skip = (pageNumber - 1) * pageSize;

    const [jobs, totalJobs] = await Promise.all([
      Job.find(filters).sort({ createdAt: -1 }).skip(skip).limit(pageSize),
      Job.countDocuments(filters),
    ]);

    return res.json({
      jobs,
      page: pageNumber,
      limit: pageSize,
      totalJobs,
      totalPages: Math.ceil(totalJobs / pageSize),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.json(job);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { createJob, getJobs, getJobById };
