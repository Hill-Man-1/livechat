"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import authorMiddleware from '../middleware/authorizationMiddleware';
const userController_1 = require("../controller/userController");
const userRouter = express_1.default.Router();
userRouter.get('/profile', userController_1.getUserProfile);
userRouter.get('/profile/:userId', userController_1.getUserProfileByAdmin);
userRouter.get('/list', userController_1.getUsersList);
userRouter.get('/patients', userController_1.getUserPatient);
userRouter.put('/update/:userId', userController_1.updateUser);
exports.default = userRouter;
