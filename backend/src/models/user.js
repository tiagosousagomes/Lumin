let mongoose = require("mongoose");
const {
	type
} = require("os");


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
		validate: {
			validator: function(v) {
				return /^[a-zA-Z0-9_]+$/.test(v); // Apenas letras, números e underscores
			},
			message: (props) => `${props.value} não é um nome de usuário válido!`,
		},
	},
	avatar: {
		type: String,
		default: ""
	},
	bio: {
		type: String,
		default: ""
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	updateAt: {
		type: Date,
		default: Date.now
	},

	email: {
		type: String,
		required: true,
		unique: true,
		validate: {
			validator: function(v) {
				return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Validação de e-mail
			},
			message: (props) => `${props.value} não é um e-mail válido!`,
		},
	},
	follower: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
	},
	following: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
	},
});

userSchema.pre("save", function(next) {
	this.updatedAt = Date.now();
	next();
});

module.exports = mongoose.model("user", userSchema);