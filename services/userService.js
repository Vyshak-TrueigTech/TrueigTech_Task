import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';

class UserService {
    // Register a new user
    static async registerUser(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const userdetails = await db.user.create({
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
        });

        return userdetails;
    }

    // Login method
    static async loginUser(credentials) {
        const userData = await db.user.findOne({
            where: { email: credentials.email },
        });
        if (!userData) {
            throw new Error('User not found');
        }
        const isPasswordValid = await bcrypt.compare(credentials.password, userData.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        // Create JWT token
        const token = jwt.sign(
            { id: userData.id, email: userData.email, name: userData.name },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' },
        );
        return { user: userData, token };
    }

    // Fetch user with their associated post
    static async getUserWithPost(userId) {
        return await db.user.findOne({
            where: { id: userId },
            attributes: ['name', 'email'],
            include: [{ model: db.post, as: 'post', attributes: ['title', 'content', 'userId'] }],
        });
    }

    // Get all users with their posts
    static async getAllUserWithPost() {
        return await db.user.findAll({
            attributes: ['name'],
            include: [{ model: db.post, as: 'post', attributes: ['title', 'content'], required: true }],
        });
    }
//Get user post
static async getPostsSharedByUser(userId) {
        const user = await db.user.findByPk(userId, {
            include: [
                {
                    model: db.post,
                    as: 'sharedPosts',
                    attributes: ['id', 'title', 'content'],
                    through: { attributes: [] },
                    include: [
                        {
                            model: db.user,
                            as: 'user',
                            attributes: ['name']
                        },
                    ],
                },
            ],
        });
        if (!user) {
            throw new Error('User not found');
        }
        return user.sharedPosts; 
    }
}

// Default export
export default UserService;
