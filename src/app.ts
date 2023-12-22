import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import express from 'express';
import router from './router/mainRouter';
import 'dotenv/config'
import insertAdmin from './config/superAdmin';


// // Load environment variables
dotenv.config();

const port = process.env.PORT;
const mongoUri = process.env.URI;

if (!mongoUri) {
    console.error('MongoDB URI is not set in .env file');
    process.exit(1);
}

const app = express();
app.use(cors({
    origin: ['http://localhost:5173'], // Specify your client's origin here
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(router);

const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: ['http://localhost:5173'], // Same as above
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
mongoose.connect(mongoUri)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error('MongoDB connection error:', err));

interface OnlineUser {
    userId: string;
    socketIds: string[];
}

let onlineUsers: OnlineUser[] = [];

const addUser = (userId: string, socketId: string): void => {
    const existingUser = onlineUsers.find(user => user.userId === userId);
    if (existingUser) {
        if (!existingUser.socketIds.includes(socketId)) {
            existingUser.socketIds.push(socketId);
        }
    } else {
        onlineUsers.push({ userId, socketIds: [socketId] });
    }
};

const removeUser = (socketId: string): void => {
    onlineUsers = onlineUsers.map(user => ({
        ...user,
        socketIds: user.socketIds.filter(id => id !== socketId)
    })).filter(user => user.socketIds.length > 0);
};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on("addNewUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getOnlineUsers", onlineUsers);
    });

    socket.on("sendMessage", (message: { recipientId: string; senderId: string; text: string }) => {
        const recipient = onlineUsers.find(user => user.userId === message.recipientId);
        if (recipient) {
            recipient.socketIds.forEach(socketId => {
                io.to(socketId).emit("getMessage", message);
            });
        }
    
        io.to(socket.id).emit("getMessage", message);
    });

    socket.on('userLogout', (userId) => {
        console.log('User logged out:', userId);
        removeUser(socket.id);
        io.emit("getOnlineUsers", onlineUsers);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        removeUser(socket.id);
        io.emit("getOnlineUsers", onlineUsers);
    });
});

// super admin account:
app.post('/setupadmin', async (req, res) => {
    await insertAdmin(req); 
    res.status(200).send('Admin setup complete');
});

server.listen(port, () => {
    console.log(`Server is running on port:${port}`);
});


