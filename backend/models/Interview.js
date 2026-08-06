const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true },
    scheduledAt: { type: Date, required: true },
    mode: { type: String, enum: ["in_person", "phone", "video"], default: "video" },
    location: { type: String }, // address or meeting link
    status: {
      type: String,
      enum: ["proposed", "confirmed", "rescheduled", "completed", "cancelled"],
      default: "proposed",
    },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);
