const createCommentUC = require("../usecases/comment/createComment");
const deleteCommentUC = require("../usecases/comment/deleteComment");
const getCommentsByPostUC = require("../usecases/comment/getCommentsByPost");

const createComment = async (req, res) => {
	try {
		const { postID, content } = req.body;

		const comment = await createCommentUC(userID, postID, content);

		res.status(200).json({
			success: true,
			message: "Comentario adicionado com sucesso.",
			data: comment,
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
		const { postID } = req.params;

		const comments = await getCommentsByPostUC(postID);

		res.status(200).json({
			success: true,
			message: "Comentarios encontrados com sucesso.",
			data: comments,
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: "erro ao listar comentarios",
			error: err.message,
		});
	}
};

const deleteComment = async (req, res) => {
	try {
		const { commentID } = req.params;

		await deleteCommentUC(commentID);

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