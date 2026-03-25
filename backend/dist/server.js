"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const prompt_routes_1 = __importDefault(require("./routes/prompt.routes"));
const comment_routes_1 = __importDefault(require("./routes/comment.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const message_routes_1 = __importDefault(require("./routes/message.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
    cors: {
        origin: [CLIENT_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
        methods: ["GET", "POST"]
    }
});
let users = [];
const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
};
const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};
const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('addUser', (userId) => {
        addUser(userId, socket.id);
        io.emit('getUsers', users);
    });
    socket.on('sendMessage', ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        if (user) {
            io.to(user.socketId).emit('getMessage', {
                senderId,
                text,
            });
        }
    });
    socket.on('markSeen', ({ senderId, receiverId }) => {
        const user = getUser(senderId);
        if (user) {
            io.to(user.socketId).emit('messageSeen', {
                receiverId
            });
        }
    });
    socket.on('disconnect', () => {
        console.log('a user disconnected');
        removeUser(socket.id);
        io.emit('getUsers', users);
    });
});
(0, db_1.default)();
app.use((0, cors_1.default)({
    origin: [CLIENT_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/auth', auth_routes_1.default);
app.use('/api/prompts', prompt_routes_1.default);
app.use('/api/comments', comment_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/notifications', notification_routes_1.default);
app.use('/api/messages', message_routes_1.default);
app.get('/', (request, response) => {
    response.send('API is running...');
});
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
