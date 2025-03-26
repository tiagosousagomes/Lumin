let mongoose = require("mongoose");

let commentSchema = new mongoose.Schema({
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
	content: {
		type: String,
		required: [true, "O conteúdo do comentário é obrigatório"],
		minlength: [1, "O conteúdo do comentário não pode ser vazio"],
	},
	createAt: {
		type: Date,
		default: Date.now
	},
	updateAt: {
		type: Date,
		default: Date.now
	},
});

commentSchema.pre("save", function(next) {
	this.updateAt = Date.now();
	next();
});

module.exports = mongoose.model("comment", commentSchema);