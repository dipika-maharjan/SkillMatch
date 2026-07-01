import SavedJob from "../models/SavedJob.js";
import Job from "../models/Job.js";

const saveJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const existing = await SavedJob.findOne({
      user: req.user._id,
      job: job._id,
    });
    if (existing) {
      return res.status(200).json({ message: "Job already saved" });
    }

    const savedJob = await SavedJob.create({
      user: req.user._id,
      job: job._id,
    });

    return res.status(201).json(savedJob);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const unsaveJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await SavedJob.findOneAndDelete({ user: req.user._id, job: job._id });
    return res.json({ message: "Job removed from saved list" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ user: req.user._id })
      .sort({ savedAt: -1 })
      .populate({
        path: "job",
        select:
          "title company location workType experienceLevel category salaryMin salaryMax description skills postedAt",
      });

    return res.json({ savedJobs });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getSavedJobIds = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ user: req.user._id }).select("job");
    const jobIds = savedJobs.map((savedJob) => savedJob.job.toString());
    return res.json({ jobIds });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { saveJob, unsaveJob, getSavedJobs, getSavedJobIds };
