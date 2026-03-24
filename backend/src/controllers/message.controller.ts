import { Request, Response } from 'express';
import Message from '../models/Message';
import User from '../models/User';
import Notification from '../models/Notification';

export const sendMessage = async (request: Request, response: Response): Promise<void> => {
    try {
        const { text } = request.body;
        const { id: receiverId } = request.params;
        const senderId = request.user?._id;

        if (!text) {
            response.status(400).json({ message: 'Message text is required' });
            return;
        }

        let conversation = await Message.create({
            sender: senderId,
            receiver: receiverId,
            text
        });

        await Notification.create({
            user: receiverId,
            type: 'message',
            fromUser: senderId,
            isRead: false
        });

        const populatedMessage = await Message.findById(conversation._id)
            .populate('sender', 'username avatar')
            .populate('receiver', 'username avatar');

        response.status(201).json(populatedMessage);
    } catch (error: any) {
        response.status(500).json({ message: error.message });
    }
};

export const getMessages = async (request: Request, response: Response): Promise<void> => {
    try {
        const { id: userToChatId } = request.params;
        const senderId = request.user?._id;

        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: userToChatId },
                { sender: userToChatId, receiver: senderId }
            ]
        }).sort({ createdAt: 1 });

        response.status(200).json(messages);
    } catch (error: any) {
        response.status(500).json({ message: error.message });
    }
};

export const getConversations = async (request: Request, response: Response): Promise<void> => {
    try {
        const currentUserId = request.user?._id;

        if (!currentUserId) {
            response.status(401).json({ message: 'User not authorized' });
            return;
        }

        const messages = await Message.find({
            $or: [
                { sender: currentUserId },
                { receiver: currentUserId }
            ]
        }).sort({ createdAt: -1 });

        const userIds = new Set<string>();
        messages.forEach(msg => {
            if (msg.sender.toString() !== currentUserId.toString()) {
                userIds.add(msg.sender.toString());
            }
            if (msg.receiver.toString() !== currentUserId.toString()) {
                userIds.add(msg.receiver.toString());
            }
        });

        const users = await User.find({ _id: { $in: Array.from(userIds) } }).select('username avatar');

        response.status(200).json(users);
    } catch (error: any) {
        response.status(500).json({ message: error.message });
    }
};

export const markMessagesAsSeen = async (request: Request, response: Response): Promise<void> => {
    try {
        const { id: senderId } = request.params;
        const receiverId = request.user?._id;

        await Message.updateMany(
            { sender: senderId, receiver: receiverId, seen: false },
            { $set: { seen: true } }
        );

        response.status(200).json({ message: 'Messages marked as seen' });
    } catch (error: any) {
        response.status(500).json({ message: error.message });
    }
};
