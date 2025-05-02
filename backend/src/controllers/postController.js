const Post = require("../models/post/postModel");
const User = require("../models/user/userModel");
const multer = require("multer");

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
		const {
			content,
			author
		} = req.body;
		const image = req.file;

		const user = await User.findById(author);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "Autor não encontrado",
			});
		}

		const post = new Post({
			content,
			author,
			image: image ? {
				data: image.buffer,
				contentType: image.mimetype
			} : undefined,
		});

		await post.save();

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

// Listar todos os posts
const getAllPosts = async (req, res) => {
	try {
		const posts = await Post.find()
			.sort({
				createAt: -1
			})
			.populate("author", "name username profilePicture")
			.populate({
				path: "comments",
				populate: {
					path: "author",
					select: "name username profilePicture"
				}
			});

		res.status(200).json({
			success: true,
			message: "Lista de Posts:",
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

// Obter todos os posts de um usuário
const getAllPostFromUser = async (req, res) => {
	try {
		const userID = req.params.id;

		const user = await User.findById(userID);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "Usuário não encontrado",
			});
		}

		const posts = await Post.find({
				author: userID
			})
			.sort({
				createAt: -1
			})
			.populate("author", "name username profilePicture")
			.populate({
				path: "comments",
				populate: {
					path: "author",
					select: "name username profilePicture"
				}
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

// Obter um post por ID
const getPostById = async (req, res) => {
	try {
		const postID = req.params.id;
		const post = await Post.findById(postID)
			.populate("author", "name username profilePicture")
			.populate({
				path: "comments",
				populate: {
					path: "author",
					select: "name username profilePicture"
				}
			});

		if (!post) {
			return res.status(404).json({
				success: false,
				message: "Post não encontrado!",
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

// Atualizar um post
const updatePost = async (req, res) => {
	try {
		const {
			content
		} = req.body;
		const image = req.file;

		const updateData = {
			content,
			updateAt: Date.now() // Atualiza a data de atualização
		};

		if (image) {
			updateData.image = {
				data: image.buffer,
				contentType: image.mimetype
			};
		}

		const post = await Post.findByIdAndUpdate(req.params.id, updateData, {
			new: true,
			runValidators: true,
		}).populate("author", "name username profilePicture");

		if (!post) {
			return res.status(404).json({
				success: false,
				message: "Post não encontrado!",
			});
		}

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

// Deletar um post
const deletePost = async (req, res) => {
	try {
		const postID = req.params.id;
		const post = await Post.findByIdAndDelete(postID);

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
        const userID = req.body.userId; ão

        // Verifica se o post existe
        const post = await Post.findById(postID);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post não encontrado",
            });
        }

        
        const index = post.likes.indexOf(userID);

        if (index === -1) {
            post.likes.push(userID);
        } else {
            post.likes.splice(index, 1);
        }

      
        await post.save();

        res.status(200).json({
            success: true,
            message: index === -1 ? "Post curtido com sucesso" : "Post descurtido com sucesso",
            liked: index === -1,
            likesCount: post.likes.length,
            likes: post.likes, 
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