    const express = require('express');
    const authMiddleware = require('../middleware/authMiddleware');
    const { generatePost, getPostsHistory } = require('../controllers/postController');

    const router = express.Router();

    // The POST route to generate a new post
    // It is now correctly mapped to the /generate path
    router.post('/generate', authMiddleware, generatePost);

    // The GET route to get the post history for the authenticated user
    // It is now correctly mapped to the / path
    router.get('/', authMiddleware, getPostsHistory);

    module.exports = router;