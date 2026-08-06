const Job = require("../models/Job");

// GET /api/search?q=&location=&salaryMin=&salaryMax=&experience=
const searchJobs = async (req, res, next) => {
  try {
    const { q, location, salaryMin, salaryMax, jobType, page = 1, limit = 10 } = req.query;

    const filter = { status: "open" };
    if (q) filter.$text = { $search: q };
    if (location) filter.location = new RegExp(location, "i");
    if (jobType) filter.jobType = jobType;
    if (salaryMin || salaryMax) {
      filter.salaryMax = filter.salaryMax || {};
      if (salaryMin) filter.salaryMax.$gte = Number(salaryMin);
      if (salaryMax) filter.salaryMin = { $lte: Number(salaryMax) };
    }

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

module.exports = { searchJobs };
