import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import promptRoutes from './routes/prompt.routes';
import commentRoutes from './routes/comment.routes';
import userRoutes from './routes/user.routes';
import notificationRoutes from './routes/notification.routes';
import messageRoutes from './routes/message.routes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5001;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
    cors: {
        origin: [CLIENT_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
        methods: ["GET", "POST"]
    }
});

let users: any[] = [];

const addUser = (userId: string, socketId: string) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
};

const removeUser = (socketId: string) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId: string) => {
    return users.find((user) => user.userId === userId);
};

io.on('connection', (socket: any) => {
    console.log('a user connected');

    socket.on('addUser', (userId: string) => {
        addUser(userId, socket.id);
        io.emit('getUsers', users);
    });

    socket.on('sendMessage', ({ senderId, receiverId, text }: any) => {
        const user = getUser(receiverId);
        if (user) {
            io.to(user.socketId).emit('getMessage', {
                senderId,
                text,
            });
        }
    });

    socket.on('markSeen', ({ senderId, receiverId }: any) => {
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


connectDB();


app.use(cors({
    origin: [CLIENT_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', authRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);


app.get('/', (request: Request, response: Response) => {
    response.send('API is running...');
});


httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
