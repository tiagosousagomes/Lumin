let mongoose = require("mongoose");

let commentSchema = new mongoose.Schema({
	author: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
			required: true
		},
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
		maxlenghth: [300, "O conteúdo do comentário deve ter no máximo 300 caracteres"],
		trim: true,
	},
},{
	timestamps:true
});

module.exports = commentSchema