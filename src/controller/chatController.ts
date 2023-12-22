import { Request, Response } from 'express';
import chatRoomModel from '../models/chatRoomModel'; // Adjust the path if needed
import UserModel from '../models/userModel'; // Adjust the path if needed
import MedicalPersonnelModel from '../models/medicalPersonnelModel'; // Adjust the path if needed

// Define an interface if you have specific types for the request body
interface ChatCreateRequestBody {
    firstId: string;
    secondId: string;
}

const createChat = async (req: Request<{}, {}, ChatCreateRequestBody>, res: Response): Promise<Response> => {
    const { firstId, secondId } = req.body;

    try {
        // Find users regardless of whether they are a patient or doctor
        const userOne = await UserModel.findOne({ _id: firstId }) || await MedicalPersonnelModel.findOne({ _id: firstId });
        const userTwo = await UserModel.findOne({ _id: secondId }) || await MedicalPersonnelModel.findOne({ _id: secondId });

        if (!userOne || !userTwo) {
            return res.status(404).json({ message: "Users not found" });
        }

        // Check if a chat already exists between the two users
        let chat = await chatRoomModel.findOne({ members: { $all: [firstId, secondId] } });

        if (chat) {
            return res.status(200).json({ data: chat });
        }

        // Create a new chat if none exists
        chat = new chatRoomModel({ members: [firstId, secondId] });
        const savedChat = await chat.save();
        return res.status(201).json({ data: savedChat });
    } catch (err) {
        console.error('Error creating chat:', err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
};

const findUserChat = async (req: Request<{ userId: string }>, res: Response): Promise<Response> => {
    const userId = req.params.userId;

    try {
        const chats = await chatRoomModel.find({
            members: { $in: [userId] },
        });
        return res.status(200).json(chats);
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
};

const findChat = async (req: Request<{ firstId: string; secondId: string }>, res: Response): Promise<Response> => {
    const { firstId, secondId } = req.params;

    try {
        const chat = await chatRoomModel.findOne({
            members: { $all: [firstId, secondId] },
        });
        return res.status(200).json(chat);
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
};

export { findChat, findUserChat, createChat };
