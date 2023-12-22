"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authorizationMiddleware_1 = __importDefault(require("../middleware/authorizationMiddleware"));
const userController_1 = require("../controller/userController");
const userRouter = express_1.default.Router();
userRouter.get('/profile', userController_1.getUserProfile);
userRouter.get('/profile/:userId', (0, authorizationMiddleware_1.default)(['staff', 'admin']), userController_1.getUserProfileByAdmin);
userRouter.get('/list', (0, authorizationMiddleware_1.default)(['staff', 'admin']), userController_1.getUsersList);
userRouter.get('/patient/list', (0, authorizationMiddleware_1.default)(['staff', 'admin']), userController_1.getPatientsList);
userRouter.put('/update', userController_1.updateUser);
exports.default = userRouter;
