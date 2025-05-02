const Comment = require("../models/comment/commentModel");
const User = require("../models/user/userModel");
const Post = require("../models/post/postModel");

const createComment = async (req, res) => {
	try {
		const {
			userID,
			postID,
			content
		} = req.body;

		console.log({
			userID,
			postID
		});

		const user = await User.findById(userID);
		const post = await Post.findById(postID);

		if (!user || !post) {
			return res.status(404).json({
				success: false,
				message: "Usuario ou post não encontrado!",
			});
		}

		const comment = new Comment({
			author: userID,
			post: postID,
			content
		});
		await comment.save();

		res.status(201).json({
			success: true,
			message: "comentario adicionado",
			data: post,
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: "erro ao adicionar comentario",
			error: err.message,
		});
	}
};

const getCommentsByPost = async (req, res) => {
	try {
		const postID = req.params.postID;

		const comment = await Comment.find({
			post: postID
		}).populate(
			"author",
			"name username profilePicture"
		);

		console.log(comment);

		res.status(200).json({
			success: true,
			message: "comentarios encontradas com sucesso.",
			data: comment,
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: "erro ao listar comentarios",
			error: err.message,
		});
	}
};

/* 
const updateComment = async (req, res) => {
  try {
    const { commentID } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(commentID);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comentário não encontrado",
      });
    }

    comment.content = content;
    comment.updatedAt = Date.now();
    await comment.save();

    res.status(200).json({
      success: true,
      message: "Comentário atualizado com sucesso",
      data: comment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar comentário",
      error: err.message,
    });
  }
};
*/
const deleteComment = async (req, res) => {
	try {
		const {
			commentID
		} = req.params;

		const comment = await Comment.findByIdAndDelete(commentID);
		if (!comment) {
			return res.status(404).json({
				success: false,
				message: "Comentário não encontrado",
			});
		}

		res.status(200).json({
			success: true,
			message: "Comentário deletado com sucesso",
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: "Erro ao  deletar comentário",
			error: err.message,
		});
	}
};

module.exports = {
	createComment,
	getCommentsByPost,
	deleteComment,
};