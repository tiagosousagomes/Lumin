import { Schema, model } from "mongoose";

let postSchema = new Schema({
  content: {
    type: String,
    required: [true, "o conteudo da publicação é obrigatorio"],
    minlenght: [1, "o conteudo não pode estar vazio"],
  },
  author: { type: Schema.Types.ObjectId, ref: "user", required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: "user" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});

postSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default model("post", postSchema);
