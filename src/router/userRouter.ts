import express from 'express'
import authorMiddleware from '../middleware/authorizationMiddleware';
import { getPatientsList, getUserProfile, getUserProfileByAdmin, getUsersList, updateUser } from '../controller/userController';

const userRouter = express.Router()

userRouter.get('/profile', getUserProfile);
userRouter.get('/profile/:userId', authorMiddleware(['staff','admin']), getUserProfileByAdmin);
userRouter.get('/list', authorMiddleware(['staff','admin']), getUsersList)
userRouter.get('/patient/list', authorMiddleware(['staff','admin']), getPatientsList)
userRouter.put('/update', updateUser);

export default userRouter;