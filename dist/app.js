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
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const mainRouter_1 = __importDefault(require("./router/mainRouter"));
require("dotenv/config");
const superAdmin_1 = __importDefault(require("./config/superAdmin"));
// // Load environment variables
dotenv_1.default.config();
const port = process.env.PORT;
const mongoUri = process.env.URI;
if (!mongoUri) {
    console.error('MongoDB URI is not set in .env file');
    process.exit(1);
}
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173'], // Specify your client's origin here
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(mainRouter_1.default);
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ['http://localhost:5173'], // Same as above
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
mongoose_1.default.connect(mongoUri)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error('MongoDB connection error:', err));
let onlineUsers = [];
const addUser = (userId, socketId) => {
    const existingUser = onlineUsers.find(user => user.userId === userId);
    if (existingUser) {
        if (!existingUser.socketIds.includes(socketId)) {
            existingUser.socketIds.push(socketId);
        }
    }
    else {
        onlineUsers.push({ userId, socketIds: [socketId] });
    }
};
const removeUser = (socketId) => {
    onlineUsers = onlineUsers.map(user => (Object.assign(Object.assign({}, user), { socketIds: user.socketIds.filter(id => id !== socketId) }))).filter(user => user.socketIds.length > 0);
};
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on("addNewUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getOnlineUsers", onlineUsers);
    });
    socket.on("sendMessage", (message) => {
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
app.post('/setupadmin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, superAdmin_1.default)(req);
    res.status(200).send('Admin setup complete');
}));
server.listen(port, () => {
    console.log(`Server is running on port:${port}`);
});
