const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: { type: String },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
