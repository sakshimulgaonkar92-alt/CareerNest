const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    agencyName: { type: String, trim: true },
    linkedEmployerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employer" }],
    commissionRate: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recruiter", recruiterSchema);
