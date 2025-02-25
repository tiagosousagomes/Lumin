const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController');

router.post('/posts', PostController.createPost);
router.get('/posts', PostController.getAllPosts);

module.exports = router;