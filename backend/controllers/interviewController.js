const Interview = require("../models/Interview");
const Application = require("../models/Application");

// POST /api/interviews  (employer/recruiter/admin - requires Shortlisted status - BR-20)
const scheduleInterview = async (req, res, next) => {
  try {
    const { applicationId, scheduledAt, mode, location, notes } = req.body;

    const application = await Application.findById(applicationId).populate("jobId");
    if (!application) return res.status(404).json({ message: "Application not found" });

    if (req.user.role !== "admin" && String(application.jobId.postedBy) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to schedule for this application" });
    }

    if (!["shortlisted", "interview"].includes(application.status)) {
      return res.status(400).json({ message: "Application must be shortlisted before scheduling an interview (BR-20)" });
    }

    const interview = await Interview.create({
      applicationId,
      scheduledAt,
      mode,
      location,
      notes,
      status: "proposed",
    });

    if (application.status === "shortlisted") {
      application.status = "interview";
      await application.save();
    }

    res.status(201).json(interview);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/interviews/:id/confirm  (both parties confirm - BR-05)
const confirmInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ message: "Interview not found" });

    interview.status = "confirmed";
    await interview.save();
    res.json(interview);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/interviews/:id/reschedule
const rescheduleInterview = async (req, res, next) => {
  try {
    const { scheduledAt } = req.body;
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ message: "Interview not found" });

    interview.scheduledAt = scheduledAt;
    interview.status = "rescheduled";
    await interview.save();
    res.json(interview);
  } catch (err) {
    next(err);
  }
};

// GET /api/interviews/:applicationId
const getInterviewsForApplication = async (req, res, next) => {
  try {
    const interviews = await Interview.find({ applicationId: req.params.applicationId }).sort({ scheduledAt: -1 });
    res.json(interviews);
  } catch (err) {
    next(err);
  }
};

module.exports = { scheduleInterview, confirmInterview, rescheduleInterview, getInterviewsForApplication };
