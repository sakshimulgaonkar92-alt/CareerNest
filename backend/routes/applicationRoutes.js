const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");
const {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
  withdrawApplication,
} = require("../controllers/applicationController");

router.post("/", protect, authorize("job_seeker"), applyToJob);
router.get("/my", protect, authorize("job_seeker"), getMyApplications);
router.get("/job/:jobId", protect, authorize("employer", "recruiter"), getApplicationsForJob);
router.patch("/:id/status", protect, authorize("employer", "recruiter"), updateApplicationStatus);
router.patch("/:id/withdraw", protect, authorize("job_seeker"), withdrawApplication);

module.exports = router;
