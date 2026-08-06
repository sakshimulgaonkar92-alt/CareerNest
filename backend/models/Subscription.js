const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    ownerType: { type: String, enum: ["employer", "recruiter"], required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "ownerModel" },
    ownerModel: { type: String, enum: ["Employer", "Recruiter"], required: true },
    plan: { type: String, enum: ["free", "basic", "pro", "enterprise"], default: "free" },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ["active", "expired", "cancelled"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
