const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    jobSeekerId: { type: mongoose.Schema.Types.ObjectId, ref: "JobSeeker", required: true },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "interview", "hired", "rejected", "withdrawn"],
      default: "applied",
    },
    resumeUrlSnapshot: { type: String }, // resume as it was at time of applying
    coverNote: { type: String },
  },
  { timestamps: true }
);

// A job seeker can only apply once to a given job (BR-02)
applicationSchema.index({ jobId: 1, jobSeekerId: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
