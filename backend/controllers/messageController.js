const Message = require("../models/Message");
const Application = require("../models/Application");
const JobSeeker = require("../models/JobSeeker");

// Helper: confirm the requesting user is part of this application thread
const canAccessApplication = async (application, user) => {
  if (user.role === "admin") return true;

  if (user.role === "job_seeker") {
    const jobSeeker = await JobSeeker.findOne({ userId: user._id });
    return jobSeeker && String(application.jobSeekerId) === String(jobSeeker._id);
  }

  // employer / recruiter - must be the poster of the job
  return String(application.jobId.postedBy) === String(user._id);
};

// POST /api/messages  { applicationId, text, attachmentUrl }
const sendMessage = async (req, res, next) => {
  try {
    const { applicationId, text, attachmentUrl } = req.body;

    const application = await Application.findById(applicationId).populate("jobId");
    if (!application) return res.status(404).json({ message: "Application not found" });

    // BR-04 / BR-19: messaging is scoped to an existing application thread
    const allowed = await canAccessApplication(application, req.user);
    if (!allowed) return res.status(403).json({ message: "Not authorized to message on this application" });

    const message = await Message.create({
      applicationId,
      senderId: req.user._id,
      text,
      attachmentUrl,
    });

    // req.io is attached in server.js for real-time emit
    if (req.io) req.io.to(`application:${applicationId}`).emit("newMessage", message);

    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
};

// GET /api/messages/:applicationId
const getMessages = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.applicationId).populate("jobId");
    if (!application) return res.status(404).json({ message: "Application not found" });

    const allowed = await canAccessApplication(application, req.user);
    if (!allowed) return res.status(403).json({ message: "Not authorized to view these messages" });

    const messages = await Message.find({ applicationId: req.params.applicationId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

module.exports = { sendMessage, getMessages };
