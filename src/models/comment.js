let mongoose = require("mongoose");

let commentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "post", required: true },
  content: {
    type: String,
    required: [true, "o conteudo do comentario é obrigatorio"],
    minlenght: [1, " o conteudo do comentario não pode ser vazio"],
  },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});

postSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("comment", commentSchema);
