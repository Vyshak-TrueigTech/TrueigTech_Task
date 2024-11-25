import express from 'express';
import {
    userRegister,
    userLogin,
    userHome,
    createPost,
    getUserWithPost,
    getAllUserData,
    updatePost,
    deletePost,
    paginatedPost,
    sharePost,
    getPostsSharedByUser
} from '../controllers/userController.js'; 
import userAuthentication from '../middleware/userAuth.js';

const userRoute = express();

userRoute.post('/createUser', userRegister);
userRoute.post('/login', userLogin);
userRoute.get('/home', userAuthentication, userHome);
userRoute.post('/createPost', userAuthentication, createPost);
userRoute.get('/userPost', userAuthentication, getUserWithPost);
userRoute.get('/allUserData', userAuthentication, getAllUserData);
userRoute.put('/updatePost/:id', userAuthentication, updatePost);
userRoute.delete('/deletePost/:id', userAuthentication, deletePost);
userRoute.get('/users',userAuthentication, paginatedPost)
userRoute.post('/sharepost',userAuthentication,sharePost)
userRoute.get('/posts/shared',userAuthentication,getPostsSharedByUser)

export default userRoute;
