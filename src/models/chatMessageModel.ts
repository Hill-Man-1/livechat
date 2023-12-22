import mongoose, { Schema } from 'mongoose';

const chatMessageSchema = new Schema({
    chatId: { type: String, required: true },
    senderId: { type: String, required: true },
    text: { type: String, required: true },
}, {
    timestamps: true,
});

const ChatMessageModel = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessageModel;
