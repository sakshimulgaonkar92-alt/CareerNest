const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");
const { createJob, getJobs, getJobById, updateJob, deleteJob } = require("../controllers/jobController");

router.get("/", getJobs); // public
router.get("/:id", getJobById); // public

router.post("/", protect, authorize("employer", "recruiter"), createJob);
router.put("/:id", protect, authorize("employer", "recruiter"), updateJob);
router.delete("/:id", protect, authorize("employer", "recruiter"), deleteJob);

module.exports = router;
