let mongoose = require("mongoose");
let emailValidator = require("./validators/userEmailValidator")
let usernameValidator = require("./validators/userUsernameValidator")

let userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "o nome é obrigatório"],
		unique: true,
		trim: true,
		minlength: [4, "o nome deve conter pelo menos 4 caracteres"],
		maxlength: [50, "o nome deve conter no máximo 50 caracteres"],
		index: true,
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
		maxlength: [60, "a bio deve conter no máximo 60 caracteres"],
		default: ""
	},
	email: {
		type: String,
		required: true,
		unique: true,
		validate: emailValidator,
		lowercase: true,
	},

	stats: {
	 followers_count:{
		type:Number,
		default:0
	 },
	 following_count:{
		type:Number,
		default:0
	 },
	 post_count:{
		type:Number,
		default:0
	 }

	},
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