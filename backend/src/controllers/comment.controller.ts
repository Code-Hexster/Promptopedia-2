import { Request, Response } from 'express';
import Comment from '../models/Comment';
import Prompt from '../models/Prompt';
import User from '../models/User';
import Notification from '../models/Notification';

export const addComment = async (request: Request, response: Response): Promise<void> => {
    try {
        const { text } = request.body;
        const promptId = request.params.id;
        const userId = request.user?._id;

        if (!text) {
            response.status(400).json({ message: 'Please add a comment' });
            return;
        }

        if (!userId) {
            response.status(401).json({ message: 'User not authorized' });
            return;
        }

        const prompt = await Prompt.findById(promptId);

        if (!prompt) {
            response.status(404).json({ message: 'Prompt not found' });
            return;
        }

        const comment = await Comment.create({
            text,
            prompt: promptId,
            user: userId
        });

        prompt.comments.push(comment._id);
        await prompt.save();

        if (prompt.author.toString() !== userId.toString()) {
            await Notification.create({
                user: prompt.author,
                type: 'comment',
                fromUser: userId,
                promptId: prompt._id
            });
        }

        const populatedComment = await Comment.findById(comment._id).populate('user', 'username avatar');

        response.status(201).json(populatedComment);
    } catch (error: any) {
        response.status(500).json({ message: error.message });
    }
};

export const getComments = async (request: Request, response: Response): Promise<void> => {
    try {
        const promptId = request.params.id;

        const comments = await Comment.find({ prompt: promptId })
            .populate('user', 'username avatar')
            .sort({ createdAt: -1 });

        response.status(200).json(comments);
    } catch (error: any) {
        response.status(500).json({ message: error.message });
    }
};

export const deleteComment = async (request: Request, response: Response): Promise<void> => {
    try {
        const comment = await Comment.findById(request.params.id);

        if (!comment) {
            response.status(404).json({ message: 'Comment not found' });
            return;
        }

        if (comment.user.toString() !== request.user?._id.toString()) {
            response.status(401).json({ message: 'User not authorized' });
            return;
        }

        await comment.deleteOne();

        await Prompt.findByIdAndUpdate(comment.prompt, {
            $pull: { comments: comment._id }
        });

        response.status(200).json({ message: 'Comment removed' });
    } catch (error: any) {
        response.status(500).json({ message: error.message });
    }
};
