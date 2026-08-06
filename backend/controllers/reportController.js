const Application = require("../models/Application");


// GET /api/reports/hiring-funnel  (admin/employer/recruiter)
const getHiringFunnel = async (req, res, next) => {
  try {
    const matchStage = req.user.role === "admin" ? {} : {}; // narrow this by employer's own jobs in production
    const funnel = await Application.aggregate([
      { $match: matchStage },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    res.json(funnel);
  } catch (err) {
    next(err);
  }
};


const getRevenueReport = async (req, res, next) => {
  try {
    const revenue = await Payment.aggregate([
      { $match: { status: "success" } },
      {
        $group: {
          _id: { purpose: "$purpose", month: { $month: "$paidAt" }, year: { $year: "$paidAt" } },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
    ]);
    res.json(revenue);
  } catch (err) {
    next(err);
  }
};

module.exports = { getHiringFunnel, getRevenueReport };
