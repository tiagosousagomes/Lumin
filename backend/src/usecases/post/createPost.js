const User = require("../../models/user/userModel");
const Post = require("../../models/post/postModel");
const cloudinary = require("../../utils/cloudinary");
const streamifier = require("streamifier");

const createPost = async ({
    content,
    author,
    file
}) => {
    try {
        const user = await User.findById(author);
        if (!user) {
            throw new Error("User not found");
        }

        let imageData = null;

        if (file) {
            const uploadToCloudinary = (buffer) => {
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: "posts",
                        },
                        (error, result) => {
                            if (error) {
                                reject(new Error("Erro ao fazer upload da imagem"));
                            } else {
                                resolve({
                                    url: result.secure_url,
                                    image_id: result.public_id,
                                });
                            }
                        }
                    );

                    streamifier.createReadStream(buffer).pipe(uploadStream);
                });
            };

            imageData = await uploadToCloudinary(file.buffer);
        }

        const post = new Post({
            content,
            author,
            image: imageData,
        });

        await post.save();
        return post;

    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = createPost;