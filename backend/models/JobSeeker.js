const mongoose = require("mongoose");

const jobSeekerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    resumeUrl: { type: String },
    headline: { type: String, trim: true },
    skills: [{ type: String, trim: true }],
    experience: [
      {
        title: String,
        company: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],
    education: [
      {
        institution: String,
        degree: String,
        fieldOfStudy: String,
        startYear: Number,
        endYear: Number,
      },
    ],
    profileVisibility: { type: String, enum: ["public", "private"], default: "public" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobSeeker", jobSeekerSchema);
