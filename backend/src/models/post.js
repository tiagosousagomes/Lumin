let mongoose = require("mongoose");

let postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "o conteudo da publicação é obrigatorio"],
    minlength: [1, "o conteudo não pode estar vazio"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  image: {
    data: Buffer,
    contentType: String
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    default: []
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "comment",
    default: []
  }, ],
  createAt: {
    type: Date,
    default: Date.now
  },
  updateAt: {
    type: Date,
    default: Date.now
  },
});

postSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("post", postSchema);