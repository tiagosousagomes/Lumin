const Follower = require("../models/followers");
const User = require("../models/user");

const followUser = async (req, res) => {
	try {
		const {
			followerID,
			followingID
		} = req.body;

		const follower = await User.findById(followerID);
		const following = await User.findById(followingID);

		if (!follower || !following) {
			return res.status(404).json({
				succsess: false,
				message: "Usuário não encontrado",
			});
		}

		const existingFollow = await Follower.findOne({
			follower: followerID,
			following: followingID,
		});

		if (existingFollow) {
			return res.status(400).json({
				succsess: false,
				message: "Usuário já está seguindo",
			});
		}

		const follow = new Follower({
			follower: followerID,
			following: followingID,
		});

		await follow.save();

		res.status(201).json({
			succsess: true,
			message: "Usuário seguido com sucesso",
		});
	} catch (err) {
		res.status(500).json({
			succsess: false,
			message: "Erro ao seguir usuário",
		});
	}
};

const unfollowUser = async (req, res) => {
	try {
		const {
			followerID,
			followingID
		} = req.body;

		const follow = await Follower.findOneAndDelete({
			follower: followerID,
			following: followingID,
		});

		if (!follow) {
			return res.status(404).json({
				succsess: false,
				message: "Você não segue este usuário",
			});
		}

		res.status(200).json({
			succsess: true,
			message: "Você deixou de seguir este usuário",
		});
	} catch (err) {
		res.status(500).json({
			succsess: false,
			message: "Erro ao deixar de seguir usuário",
		});
	}
};

const getFollowers = async (req, res) => {
	try {
		const {
			userID
		} = req.params;

		const followers = await Follower.find({
			following: userID
		}).populate(
			"follower",
			"name username profilePicture"
		);

		res.status(200).json({
			succsess: true,
			message: "Seguidores encontrados",
			followers: followers,
		});
	} catch (err) {
		res.status(500).json({
			succsess: false,
			message: "Erro ao buscar seguidores",
		});
	}
};

const getFollowing = async (req, res) => {
	try {
		const {
			userID
		} = req.params;

		const following = await Follower.find({
			follower: userID
		}).populate(
			"following",
			"name username profilePicture"
		);

		res.status(200).json({
			succsess: true,
			message: "Lista de usuários seguidos recuperada com sucesso",
			following: following,
		});
	} catch (err) {
		res.status(500).json({
			succsess: false,
			message: "Erro ao buscar lista de usuários",
		});
	}
};

module.exports = {
	followUser,
	unfollowUser,
	getFollowers,
	getFollowing
};