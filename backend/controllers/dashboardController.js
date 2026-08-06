const Job = require("../models/Job");
const Application = require("../models/Application");
const JobSeeker = require("../models/JobSeeker");

// GET /api/dashboard  (returns different stats depending on req.user.role)
const getDashboard = async (req, res, next) => {
  try {
    const { role, _id } = req.user;

    if (role === "job_seeker") {
      const jobSeeker = await JobSeeker.findOne({ userId: _id });
      const totalApplications = jobSeeker ? await Application.countDocuments({ jobSeekerId: jobSeeker._id }) : 0;
      const statusCounts = jobSeeker
        ? await Application.aggregate([
            { $match: { jobSeekerId: jobSeeker._id } },
            { $group: { _id: "$status", count: { $sum: 1 } } },
          ])
        : [];
      return res.json({ role, totalApplications, statusCounts });
    }

    if (role === "employer" || role === "recruiter") {
      const jobs = await Job.find({ postedBy: _id });
      const jobIds = jobs.map((j) => j._id);
      const totalApplications = await Application.countDocuments({ jobId: { $in: jobIds } });
      const openJobs = jobs.filter((j) => j.status === "open").length;
      return res.json({ role, totalJobs: jobs.length, openJobs, totalApplications });
    }

    if (role === "admin") {
      const [totalJobs, totalApplications, openJobs] = await Promise.all([
        Job.countDocuments(),
        Application.countDocuments(),
        Job.countDocuments({ status: "open" }),
      ]);
      return res.json({ role, totalJobs, openJobs, totalApplications });
    }

    res.json({ role, message: "No dashboard data configured for this role" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboard };
