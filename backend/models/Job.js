const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: "Employer", required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // employer or recruiter
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    jobType: {
      type: String,
      enum: ["full_time", "part_time", "contract", "internship", "remote"],
      default: "full_time",
    },
    experienceRequired: { type: String }, // e.g. "2-4 years"
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    status: { type: String, enum: ["draft", "open", "closed"], default: "draft" },
    isFeatured: { type: Boolean, default: false },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", description: "text", category: "text", location: "text" });

module.exports = mongoose.model("Job", jobSchema);
