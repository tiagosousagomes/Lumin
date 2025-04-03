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

module.exports = mongoose.model("follow", followSchema);