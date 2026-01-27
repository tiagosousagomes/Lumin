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
},{
	timestamps:true
});
followSchema.index({ follower: 1, following: 1 }, { unique: true });

module.exports = followSchema