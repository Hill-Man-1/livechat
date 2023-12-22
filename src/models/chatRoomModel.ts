import mongoose, { Schema } from 'mongoose';

const chatRoomSchema = new Schema({
    members: { type: [String], required: true },
}, {
    timestamps: true,
});

const ChatRoomModel = mongoose.model('ChatRoom', chatRoomSchema);

export default ChatRoomModel;
