import express from 'express'
// import authorMiddleware from '../middleware/authorizationMiddleware';
import { getUserProfile, getUserProfileByAdmin, getUsersList, getUserPatient, updateUser } from '../controller/userController';

const userRouter = express.Router()

userRouter.get('/profile', getUserProfile);
userRouter.get('/profile/:userId', getUserProfileByAdmin);
userRouter.get('/list', getUsersList)
userRouter.get('/patients', getUserPatient);
userRouter.put('/update/:userId', updateUser);

export default userRouter;