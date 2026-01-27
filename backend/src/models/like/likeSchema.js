let mongoose = require("mongoose");

let likeSchema = new mongoose.Schema({
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
		required: true
	},
	post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "post",
		required: true
	},
	
},{
	timestamps:true
}
);
likeSchema.index({ user: 1, post: 1 }, { unique: true });

module.exports = likeSchema