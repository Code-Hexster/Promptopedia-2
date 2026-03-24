import { Request, Response } from 'express';
import Notification from '../models/Notification';

export const getNotifications = async (request: Request, response: Response): Promise<void> => {
    try {
        const notifications = await Notification.find({ user: request.user?._id })
            .populate('fromUser', 'username avatar')
            .populate('promptId', 'title')
            .sort({ createdAt: -1 });

        response.status(200).json(notifications);
    } catch (error: any) {
        response.status(500).json({ message: error.message });
    }
};

export const markNotificationsRead = async (request: Request, response: Response): Promise<void> => {
    try {
        await Notification.updateMany(
            { user: request.user?._id, isRead: false },
            { $set: { isRead: true } }
        );

        response.status(200).json({ message: 'Notifications marked as read' });
    } catch (error: any) {
        response.status(500).json({ message: error.message });
    }
};
