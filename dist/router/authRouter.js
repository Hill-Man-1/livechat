"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registerController_1 = require("../controller/registerController");
const loginController_1 = require("../controller/loginController");
const passwordController_1 = require("../controller/passwordController");
const authRouter = express_1.default.Router();
authRouter.post('/register', registerController_1.registerUser);
authRouter.post('/login', loginController_1.loginUser);
authRouter.post('/logout', loginController_1.logoutUser);
authRouter.post('/resetpasswordrequest', passwordController_1.resetPasswordRequest);
authRouter.post('/resetpassword', passwordController_1.resetPassword);
exports.default = authRouter;
