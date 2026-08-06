const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    companyName: { type: String, required: true, trim: true },
    logoUrl: { type: String },
    website: { type: String },
    industry: { type: String },
    subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employer", employerSchema);
