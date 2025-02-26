import { Schema, model } from "mongoose";

let commentSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "user", required: true },
  post: { type: Schema.Types.ObjectId, ref: "post", required: true },
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

export default model("comment", commentSchema);
