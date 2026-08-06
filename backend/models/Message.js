const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, trim: true },
    attachmentUrl: { type: String },
    readAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
