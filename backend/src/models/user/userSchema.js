let mongoose = require("mongoose");
let emailValidator = require("./validators/userEmailValidator")
let usernameValidator = require("./validators/userUsernameValidator")

let userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "o nome é obrigatório"]
	},
	password: {
		type: String,
		required: [true, "a senha é obrigatoria"],
		minlength: [6, "a senha deve conter pelo menos 6 digitos"],
	},
	username: {
		type: String,
		required: [true, "username é obrigatorio"],
		unique: true,
		validate: usernameValidator
	},
	avatar: {
		data: Buffer,
		contentType: String,
	},
	bio: {
		type: String,
		default: ""
	},
	email: {
		type: String,
		required: true,
		unique: true,
		validate: emailValidator
	},
	follower: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
	}],
	following: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
	}],
	location: {
		type: String,
		default: ""
	},
	headerImage: {
		data: Buffer,
		contentType: String,
	}
},{
	timestamps:true
});


module.exports = userSchema