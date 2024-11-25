import UserService from '../services/userService.js';
import PostService from '../services/postService.js';

// User registration
export const userRegister = async (req, res, next) => {
    try {
        const userData = req.body;
        const user = await UserService.registerUser(userData);
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        next({ message: error.message, statusCode: 500 });
    }
};

// User login route
export const userLogin = async (req, res, next) => {
    try {
        const credentials = req.body;
        const { user, token } = await UserService.loginUser(credentials);
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        next({ message: error.message, statusCode: 401 });
    }
};

// User home route
export const userHome = async (req, res, next) => {
    try {
        res.json({ message: `Welcome, ${req.user.name}!` });
    } catch (error) {
        next({ message: error.message, statusCode: 401 });
    }
};

// Create post
export const createPost = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const postData = req.body;
        const post = await PostService.createPost(userId, postData);
        res.status(201).json({ success: true, data: post });
    } catch (error) {
        next({ message: error.message, statusCode: 500 });
    }
};

// Get user with post
export const getUserWithPost = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userData = await UserService.getUserWithPost(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json(userData);
    } catch (error) {
        next({ message: error.message, statusCode: 401 });
    }
};

// Get all user data
export const getAllUserData = async (req, res, next) => {
    try {
        const allUserData = await UserService.getAllUserWithPost();
        if (!allUserData) {
            return res.status(404).json({ success: false, message: 'No Data Available' });
        }
        res.status(200).json(allUserData);
    } catch (error) {
        next({ message: error.message, statusCode: 401 });
    }
};

// Update post
export const updatePost = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;
        const updatedPostData = req.body;
        const post = await PostService.updatePost(userId, postId, updatedPostData);
        res.status(201).json({ success: true, message: 'Post updated successfully', data: post });
    } catch (error) {
        next({ message: error.message, statusCode: 401 });
    }
};

// Delete post
export const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;
        const post = await PostService.getPostById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        if (post.userId !== userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized to delete this post' });
        }
        // Delete the post
        await PostService.deletePost(postId);
        res.status(200).json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        next({ message: error.message, statusCode: 401 });
    }
};

export const paginatedPost = async (req, res, next) => {
    try {
        const page = req.query.page;
        const pageSize = 3;
        console.log('page',page);
        const result = await PostService.getPaginatedPost(Number(page), Number(pageSize));
        res.json({
            totalItems: result.count,
            totalPages: Math.ceil(result.count / pageSize),
            currentPage: page,
            pageSize: pageSize,
            data: result.rows
        });
    } catch (error) {
        next({ message: error.message, statusCode: 401 });
    }
};

export const sharePost = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { postId } = req.body;
        const result = await PostService.sharePost(userId, postId);
        res.status(200).json(result);
    } catch (error) {
        next({ message: error.message, statusCode: 400 });
    }
};

export const getPostsSharedByUser = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userData = await UserService.getPostsSharedByUser(userId);
        res.status(200).json(userData);
    } catch (error) {
        next({ message: error.message, statusCode: 400 });
    }
};


