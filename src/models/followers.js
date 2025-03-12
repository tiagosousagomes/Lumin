let mongoose = require("mongoose");

let followSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  createAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("follow", followSchema);
