const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");
const { getHiringFunnel, getRevenueReport } = require("../controllers/reportController");

router.get("/hiring-funnel", protect, authorize("employer", "recruiter"), getHiringFunnel);
router.get("/revenue", protect, authorize("admin"), getRevenueReport);

module.exports = router;
