import { Request, Response } from 'express';
import ChatMessageModel from '../models/chatMessageModel'; // Adjust the import path if necessary

// Define the types for the request body
interface CreateMessageRequestBody {
    chatId: string;
    senderId: string;
    text: string;
}

// Define the types for the request params if necessary
interface GetMessagesRequestParams {
    chatId: string;
}

const createMessage = async (req: Request<{}, {}, CreateMessageRequestBody>, res: Response): Promise<Response> => {
    const { chatId, senderId, text } = req.body;

    const message = new ChatMessageModel({
        chatId,
        senderId,
        text,
    });

    try {
        const response = await message.save();
        return res.status(200).json(response);
    } catch (err) {
        console.error(err);
        return res.status(400).json(err);
    }
};

const getMessages = async (req: Request<GetMessagesRequestParams>, res: Response): Promise<Response> => {
    const { chatId } = req.params;

    try {
        const messages = await ChatMessageModel.find({ chatId });
        return res.status(200).json(messages);
    } catch (err) {
        console.error(err);
        return res.status(400).json(err);
    }
};

export { createMessage, getMessages };
