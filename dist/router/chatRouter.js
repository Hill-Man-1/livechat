"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatController_1 = require("../controller/chatController");
const chatRouter = express_1.default.Router();
chatRouter.post('/', chatController_1.createChat);
chatRouter.get('/:userId', chatController_1.findUserChat);
chatRouter.get('/find/:firstId/:secondId', chatController_1.findChat);
exports.default = chatRouter;
