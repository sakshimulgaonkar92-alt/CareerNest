const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");
const {
  scheduleInterview,
  confirmInterview,
  rescheduleInterview,
  getInterviewsForApplication,
} = require("../controllers/interviewController");

router.post("/", protect, authorize("employer", "recruiter"), scheduleInterview);
router.patch("/:id/confirm", protect, confirmInterview);
router.patch("/:id/reschedule", protect, authorize("employer", "recruiter"), rescheduleInterview);
router.get("/:applicationId", protect, getInterviewsForApplication);

module.exports = router;
