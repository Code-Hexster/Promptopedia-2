import { Request, Response } from 'express';
import Prompt from '../models/Prompt';
import User from '../models/User';
import Notification from '../models/Notification';

export const createPrompt = async (request: Request, response: Response): Promise<void> => {
    try {
        const { title, promptText, modelUsed, outputImage, outputText, tags } = request.body;
        const user = request.user;

        if (!title || !promptText || !modelUsed) {
            response.status(400).json({ message: 'Please provide all required fields' });
            return;
        }

        const prompt = await Prompt.create({
            author: user?._id,
            title,
            promptText,
            modelUsed,
            outputImage,
            outputText,
            tags
        });

        await User.findByIdAndUpdate(user?._id, {
            $push: { prompts: prompt._id }
        });

        response.status(201).json(prompt);
    } catch (error: any) {
        response.status(500).json({ message: error.message });
    }
};

export const getPrompts = async (request: Request, response: Response): Promise<void> => {
    try {
        const prompts = await Prompt.find()
            .populate('author', 'username avatar')
            .sort({ createdAt: -1 });

        response.status(200).json(prompts);
    } catch (error: any) {
        response.status(500).json({ message: error.message });
    }
};

export const getPromptById = async (request: Request, response: Response): Promise<void> => {
    try {
        const prompt = await Prompt.findById(request.params.id)
            .populate('author', 'username avatar');

        if (!prompt) {
            response.status(404).json({ message: 'Prompt not found' });
            return;
        }

        response.status(200).json(prompt);
    } catch (error: any) {
        response.status(500).json({ message: error.message });
    }
};

export const deletePrompt = async (request: Request, response: Response): Promise<void> => {
    try {
        const prompt = await Prompt.findById(request.params.id);

        if (!prompt) {
            response.status(404).json({ message: 'Prompt not found' });
            return;
        }

        if (prompt.author.toString() !== request.user?._id.toString()) {
            response.status(401).json({ message: 'User not authorized' });
            return;
        }

        await prompt.deleteOne();
        response.status(200).json({ message: 'Prompt removed' });
    } catch (error: any) {
        response.status(500).json({ message: error.message });
    }
};

export const getUserPrompts = async (request: Request, response: Response): Promise<void> => {
    try {
        const prompts = await Prompt.find({ author: request.params.id })
            .populate('author', 'username avatar')
            .sort({ createdAt: -1 });

        response.status(200).json(prompts);
    } catch (error: any) {
        response.status(500).json({ message: error.message });
    }
};

export const likePrompt = async (request: Request, response: Response): Promise<void> => {
    try {
        const prompt = await Prompt.findById(request.params.id);

        if (!prompt) {
            response.status(404).json({ message: 'Prompt not found' });
            return;
        }

        const userId = request.user?._id;

        if (!userId) {
            response.status(401).json({ message: 'User not authorized' });
            return;
        }

        if (prompt.likes.includes(userId)) {
            prompt.likes = prompt.likes.filter(id => id.toString() !== userId.toString());
        } else {
            prompt.likes.push(userId);

            if (prompt.author.toString() !== userId.toString()) {
                await Notification.create({
                    user: prompt.author,
                    type: 'like',
                    fromUser: userId,
                    promptId: prompt._id
                });
            }
        }

        await prompt.save();
        response.status(200).json(prompt.likes);
    } catch (error: any) {
        response.status(500).json({ message: error.message });
    }
};

export const getFollowingPrompts = async (request: Request, response: Response): Promise<void> => {
    try {
        const user = await User.findById(request.user?._id);

        if (!user) {
            response.status(404).json({ message: 'User not found' });
            return;
        }

        const prompts = await Prompt.find({ author: { $in: user.following } })
            .populate('author', 'username avatar')
            .sort({ createdAt: -1 });

        response.status(200).json(prompts);
    } catch (error: any) {
        response.status(500).json({ message: error.message });
    }
};

export const searchPrompts = async (request: Request, response: Response): Promise<void> => {
    try {
        const { query } = request.query;

        let prompts;

        if (query) {
            prompts = await Prompt.find({
                tags: { $regex: query as string, $options: 'i' }
            })
                .populate('author', 'username avatar')
                .sort({ createdAt: -1 });
        } else {
            prompts = await Prompt.find()
                .populate('author', 'username avatar')
                .sort({ createdAt: -1 });
        }

        response.status(200).json(prompts);
    } catch (error: any) {
        response.status(500).json({ message: error.message });
    }
};
