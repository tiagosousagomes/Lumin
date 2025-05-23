const multer = require("multer");
const createPostUC = require("../usecases/post/createPost");
const deletePostUC = require("../usecases/post/deletePost");
const getAllPostsUC = require("../usecases/post/getAllPosts"); 
const getPostByIdUC = require("../usecases/post/getPostById");
const getPostsFromUserUC = require("../usecases/post/getPostsFromUser");
const likePostUC = require("../usecases/post/likePost");
const updatePostUC = require("../usecases/post/updatePost");

// Configuração do multer para armazenar a imagem na memória
const storage = multer.memoryStorage();
const upload = multer({
	storage: storage,
	limits: {
		fileSize: 5 * 1024 * 1024
	}
});

const createPost = async (req, res) => {
	try {
		const { content, author } = req.body;
		const file = req.file;
		const post = await createPostUC({
			content,
			author,
			file
		});

		res.status(201).json({
			success: true,
			message: "Post criado com sucesso",
			data: post,
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: "Erro ao criar o post",
			error: err.message,
		});
	}
};

const getAllPosts = async (req, res) => {
	try {
		const posts = await getAllPostsUC();

		res.status(200).json({
			success: true,
			message: "Posts encontrados:",
			data: posts,
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: "Erro ao listar os posts:",
			error: err.message
		});
	}
};

const getAllPostFromUser = async (req, res) => {
	try {
		const userID = req.params.id;
		const posts = await getPostsFromUserUC(userID);
		res.status(200).json({
			success: true,
			message: "Posts do usuário encontrados:",
			data: posts,
		});
	
		res.status(200).json({
			success: true,
			message: "Posts do usuário:",
			data: posts,
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: "Erro ao listar os posts de um usuário:",
			error: err.message
		});
	}
};

const getPostById = async (req, res) => {
	try {
		const postID = req.params.id;
		const post = await getPostByIdUC(postID);

		if (!post) {
			return res.status(404).json({
				success: false,
				message: "Post não encontrado",
			});
		}

		res.status(200).json({
			success: true,
			message: "Post encontrado:",
			data: post,
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: "Erro ao buscar o post:",
			error: err.message
		});
	}
};

const updatePost = async (req, res) => {
	try {
		const postID = req.params.id;
		const { content } = req.body;
		const file = req.file;

		const updatePost = await updatePostUC({ postID, content, file });

		res.status(200).json({
			success: true,
			message: "Post atualizado com sucesso",
			data: post,
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: "Erro ao atualizar o post:",
			error: err.message
		});
	}
};

const deletePost = async (req, res) => {
	try {
		const postID = req.params.id;
		await deletePostUC(postID);

		if (!post) {
			return res.status(404).json({
				success: false,
				message: "Post não encontrado",
			});
		}

		res.status(200).json({
			success: true,
			message: "Post deletado com sucesso!",
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: "Erro ao deletar o post",
			error: err.message,
		});
	}
};

const likePost = async (req, res) => {
    try {
        const postID = req.params.id; 
        const userID = req.body.userId;

		const { liked, likesCount, likes} = await likePostUC({postID, userID});

		res.status(200).json({
			success: true,
			message: liked ? "Post curtido com sucesso" : "Post descurtido com sucesso",
			data: {
				liked,
				likesCount,
				likes
			}
		});
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erro ao processar a curtida",
            error: err.message,
        });
    }
};

module.exports = {
	createPost: [upload.single("image"), createPost],
	getAllPosts,
	getAllPostFromUser,
	getPostById,
	updatePost: [upload.single("image"), updatePost],
	deletePost,
	likePost,
};