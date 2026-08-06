const Application = require("../models/Application");
const Job = require("../models/Job");
const JobSeeker = require("../models/JobSeeker");

const VALID_TRANSITIONS = {
  applied: ["shortlisted", "rejected", "withdrawn"],
  shortlisted: ["interview", "rejected", "withdrawn"],
  interview: ["hired", "rejected"],
  hired: [],
  rejected: [],
  withdrawn: [],
};

// POST /api/applications  (job seeker only)
const applyToJob = async (req, res, next) => {
  try {
    const { jobId, coverNote } = req.body;

    const job = await Job.findById(jobId);
    if (!job || job.status !== "open") {
      return res.status(400).json({ message: "Job is not open for applications" });
    }

    const jobSeeker = await JobSeeker.findOne({ userId: req.user._id });
    if (!jobSeeker) return res.status(400).json({ message: "Job seeker profile not found" });
    if (!jobSeeker.resumeUrl) {
      return res.status(400).json({ message: "Please add a resume to your profile before applying (BR-16)" });
    }

    const application = await Application.create({
      jobId,
      jobSeekerId: jobSeeker._id,
      resumeUrlSnapshot: jobSeeker.resumeUrl,
      coverNote,
    });

    res.status(201).json(application);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "You have already applied to this job (BR-02)" });
    }
    next(err);
  }
};

// GET /api/applications/my  (job seeker's own applications)
const getMyApplications = async (req, res, next) => {
  try {
    const jobSeeker = await JobSeeker.findOne({ userId: req.user._id });
    if (!jobSeeker) return res.status(404).json({ message: "Job seeker profile not found" });

    const applications = await Application.find({ jobSeekerId: jobSeeker._id })
      .populate("jobId", "title company location status")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    next(err);
  }
};

// GET /api/applications/job/:jobId  (employer/recruiter viewing applicants for their own posting - BR-12)
const getApplicationsForJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (req.user.role !== "admin" && String(job.postedBy) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to view these applications" });
    }

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate({ path: "jobSeekerId", populate: { path: "userId", select: "name email" } })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/applications/:id/status  (employer/recruiter/admin - enforces BR-03 forward-only flow)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate("jobId");
    if (!application) return res.status(404).json({ message: "Application not found" });

    if (
      req.user.role !== "admin" &&
      String(application.jobId.postedBy) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: "Not authorized to update this application" });
    }

    const allowedNext = VALID_TRANSITIONS[application.status] || [];
    if (!allowedNext.includes(status)) {
      return res.status(400).json({
        message: `Invalid status transition from '${application.status}' to '${status}' (BR-03)`,
      });
    }

    application.status = status;
    await application.save();
    res.json(application);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/applications/:id/withdraw  (job seeker only, own application)
const withdrawApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id).populate("jobSeekerId");
    if (!application) return res.status(404).json({ message: "Application not found" });

    if (String(application.jobSeekerId.userId) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to withdraw this application" });
    }

    if (["hired", "rejected", "withdrawn"].includes(application.status)) {
      return res.status(400).json({ message: "This application can no longer be withdrawn" });
    }

    application.status = "withdrawn";
    await application.save();
    res.json({ message: "Application withdrawn (cannot be resubmitted - BR-17)", application });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
  withdrawApplication,
};
