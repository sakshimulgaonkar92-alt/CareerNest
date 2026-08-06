const Job = require("../models/Job");
const Employer = require("../models/Employer");

// POST /api/jobs  (Employer/Recruiter/Admin only)
const createJob = async (req, res, next) => {
  try {
    const { employerId, title, description, category, location, jobType, experienceRequired, salaryMin, salaryMax, tags } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({ message: "title, description, category and location are required (BR-13)" });
    }

    let resolvedEmployerId = employerId;
    if (req.user.role === "employer" && !resolvedEmployerId) {
      const employer = await Employer.findOne({ userId: req.user._id });
      if (!employer) return res.status(400).json({ message: "Employer profile not found" });
      resolvedEmployerId = employer._id;
    }

    const job = await Job.create({
      employerId: resolvedEmployerId,
      postedBy: req.user._id,
      title,
      description,
      category,
      location,
      jobType,
      experienceRequired,
      salaryMin,
      salaryMax,
      tags,
      status: "draft",
    });

    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
};

// GET /api/jobs  (public listing, with basic filters)
const getJobs = async (req, res, next) => {
  try {
    const { category, location, jobType, status = "open", page = 1, limit = 20 } = req.query;
    const filter = { status };
    if (category) filter.category = category;
    if (location) filter.location = new RegExp(location, "i");
    if (jobType) filter.jobType = jobType;

    const jobs = await Job.find(filter)
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Job.countDocuments(filter);
    res.json({ jobs, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// GET /api/jobs/:id
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate("employerId", "companyName logoUrl");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    next(err);
  }
};

// PUT /api/jobs/:id  (owner or admin only)
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (req.user.role !== "admin" && String(job.postedBy) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to edit this job" });
    }

    // BR-14: closed jobs no longer accept new applications, but editing is still allowed for record-keeping
    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/jobs/:id
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (req.user.role !== "admin" && String(job.postedBy) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await job.deleteOne();
    res.json({ message: "Job deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { createJob, getJobs, getJobById, updateJob, deleteJob };
