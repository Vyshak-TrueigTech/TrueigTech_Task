import db from '../models/index.js';
class PostService {
    // Create a post
    static async createPost(userId, postData) {
        const postDetails = await db.post.create({
            title: postData.title,
            content: postData.content,
            userId: userId,
        });
        return postDetails;
    }

    // Updating post
    static async updatePost(userId, postId, updatedPostData) {
        const transaction = await db.sequelize.transaction();
        try {
            const { title, content } = updatedPostData;
            const oldPost = await db.post.findOne({
                where: {
                    id: postId,
                    userId: userId,
                },
                attributes: ['id', 'title', 'content', 'userId'],
                transaction,
            });

            if (!oldPost) {
                throw new Error('Post not found or user not authorized');
            }
            oldPost.title = title || oldPost.title;
            oldPost.content = content || oldPost.content;
            await oldPost.save({ transaction });
            await transaction.commit();
            return oldPost;
        } catch (error) {
            await transaction.rollback();
            throw new Error(error.message);
        }
    }

    // Fetch post by using id
    static async getPostById(postId) {
        return await db.post.findByPk(postId);
    }

    // Delete post
    static async deletePost(postId) {
        return await db.post.destroy({ where: { id: postId } });
    }
    // Paginated Post
    static async getPaginatedPost(page, pageSize) {
        const offset = (page - 1) * pageSize;
        const limit = pageSize;
        const { count, rows } = await db.post.findAndCountAll({ limit, offset });
        return { count, rows };
    }
    //share post
    static async sharePost(userId, postId) {
        const user = await db.user.findByPk(userId);
        const post = await db.post.findByPk(postId);
        if (!user || !post) {
            throw new Error('User or Post not found');
        }
        await db.user_post.create({ userId, postId });
        return { message: 'Post shared successfully' };
    }
    
}

// Default export
export default PostService;
