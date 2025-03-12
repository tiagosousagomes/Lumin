let mongoose = require("mongoose");

let messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
    iv: { type: String, default: true },
    createAt: { type: Date, default: Date.now },
  },
  { createAt: true }
);

module.exports = mongoose.model("message", messageSchema);
