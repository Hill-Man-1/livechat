"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChat = exports.findUserChat = exports.findChat = void 0;
const chatRoomModel_1 = __importDefault(require("../models/chatRoomModel")); // Adjust the path if needed
const userModel_1 = __importDefault(require("../models/userModel")); // Adjust the path if needed
const medicalPersonnelModel_1 = __importDefault(require("../models/medicalPersonnelModel")); // Adjust the path if needed
const createChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstId, secondId } = req.body;
    try {
        // Find users regardless of whether they are a patient or doctor
        const userOne = (yield userModel_1.default.findOne({ _id: firstId })) || (yield medicalPersonnelModel_1.default.findOne({ _id: firstId }));
        const userTwo = (yield userModel_1.default.findOne({ _id: secondId })) || (yield medicalPersonnelModel_1.default.findOne({ _id: secondId }));
        if (!userOne || !userTwo) {
            return res.status(404).json({ message: "Users not found" });
        }
        // Check if a chat already exists between the two users
        let chat = yield chatRoomModel_1.default.findOne({ members: { $all: [firstId, secondId] } });
        if (chat) {
            return res.status(200).json({ data: chat });
        }
        // Create a new chat if none exists
        chat = new chatRoomModel_1.default({ members: [firstId, secondId] });
        const savedChat = yield chat.save();
        return res.status(201).json({ data: savedChat });
    }
    catch (err) {
        console.error('Error creating chat:', err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
});
exports.createChat = createChat;
const findUserChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const chats = yield chatRoomModel_1.default.find({
            members: { $in: [userId] },
        });
        return res.status(200).json(chats);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});
exports.findUserChat = findUserChat;
const findChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstId, secondId } = req.params;
    try {
        const chat = yield chatRoomModel_1.default.findOne({
            members: { $all: [firstId, secondId] },
        });
        return res.status(200).json(chat);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});
exports.findChat = findChat;
