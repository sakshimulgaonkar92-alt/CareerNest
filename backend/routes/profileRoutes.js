const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");
const { getMyProfile, updateMyProfile, getProfileById } = require("../controllers/profileController");

router.get("/me", protect, authorize("job_seeker"), getMyProfile);
router.put("/me", protect, authorize("job_seeker"), updateMyProfile);
router.get("/:id", protect, authorize("employer", "recruiter"), getProfileById);

module.exports = router;
