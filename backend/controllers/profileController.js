const JobSeeker = require("../models/JobSeeker");

// GET /api/profile/me  (job seeker's own profile)
const getMyProfile = async (req, res, next) => {
  try {
    const profile = await JobSeeker.findOne({ userId: req.user._id }).populate("userId", "name email mobile");
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

// PUT /api/profile/me  (job seeker can only edit their own profile - BR-11)
const updateMyProfile = async (req, res, next) => {
  try {
    const profile = await JobSeeker.findOne({ userId: req.user._id });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const { resumeUrl, headline, skills, experience, education, profileVisibility } = req.body;
    if (resumeUrl !== undefined) profile.resumeUrl = resumeUrl;
    if (headline !== undefined) profile.headline = headline;
    if (skills !== undefined) profile.skills = skills;
    if (experience !== undefined) profile.experience = experience;
    if (education !== undefined) profile.education = education;
    if (profileVisibility !== undefined) profile.profileVisibility = profileVisibility;

    await profile.save();
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

// GET /api/profile/:id  (employer/recruiter viewing a candidate profile)
const getProfileById = async (req, res, next) => {
  try {
    const profile = await JobSeeker.findById(req.params.id).populate("userId", "name email");
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    if (profile.profileVisibility === "private" && req.user.role === "job_seeker") {
      return res.status(403).json({ message: "This profile is private" });
    }

    res.json(profile);
  } catch (err) {
    next(err);
  }
};

module.exports = { getMyProfile, updateMyProfile, getProfileById };
