import express from 'express'
import { registerUser } from '../controller/registerController';
import { loginUser, logoutUser } from '../controller/loginController';
import { resetPasswordRequest, resetPassword } from '../controller/passwordController';

const authRouter = express.Router()

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', logoutUser)
authRouter.post('/resetpasswordrequest', resetPasswordRequest)
authRouter.post('/resetpassword', resetPassword)

export default authRouter;