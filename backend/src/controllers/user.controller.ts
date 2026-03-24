import { Request, Response } from 'express';
import User from '../models/User';
import Prompt from '../models/Prompt';
import Notification from '../models/Notification';

export const getProfile = async (request: Request, response: Response): Promise<void> => {
    try {
        const user = await User.findById(request.params.id).select('-password');

        if (!user) {
            response.status(404).json({ message: 'User not found' });
            return;
        }

        const prompts = await Prompt.find({ author: user._id }).sort({ createdAt: -1 });

        response.json({ user, prompts });
    } catch (error: any) {
        response.status(500).json({ message: error.message });
    }
};

export const followUser = async (request: Request, response: Response): Promise<void> => {
    try {
        const userToFollow = await User.findById(request.params.id);
        const currentUser = await User.findById(request.user?._id);

        if (!userToFollow || !currentUser) {
            response.status(404).json({ message: 'User not found' });
            return;
        }

        if (userToFollow._id.toString() === currentUser._id.toString()) {
            response.status(400).json({ message: 'You cannot follow yourself' });
            return;
        }

        if (userToFollow.followers.includes(currentUser._id)) {
            userToFollow.followers = userToFollow.followers.filter(
                (id) => id.toString() !== currentUser._id.toString()
            );
            currentUser.following = currentUser.following.filter(
                (id) => id.toString() !== userToFollow._id.toString()
            );
            await userToFollow.save();
            await currentUser.save();
            response.json({ message: 'User unfollowed', isFollowing: false });
        } else {
            // Follow
            userToFollow.followers.push(currentUser._id);
            currentUser.following.push(userToFollow._id);
            await userToFollow.save();
            await currentUser.save();

            await Notification.create({
                user: userToFollow._id,
                type: 'follow',
                fromUser: currentUser._id
            });

            response.json({ message: 'User followed', isFollowing: true });
        }
    } catch (error: any) {
        response.status(500).json({ message: error.message });
    }
};

export const savePrompt = async (request: Request, response: Response): Promise<void> => {
    try {
        const { id } = request.params;
        const userId = request.user?._id;

        const user = await User.findById(userId);

        if (!user) {
            response.status(404).json({ message: 'User not found' });
            return;
        }

        const isSaved = user.savedPrompts.includes(id as any);

        if (isSaved) {
            await User.findByIdAndUpdate(userId, { $pull: { savedPrompts: id } });
            response.status(200).json({ message: 'Prompt unsaved' });
        } else {
            await User.findByIdAndUpdate(userId, { $push: { savedPrompts: id } });
            response.status(200).json({ message: 'Prompt saved' });
        }
    } catch (error: any) {
        response.status(500).json({ message: error.message });
    }
};

export const getSavedPrompts = async (request: Request, response: Response): Promise<void> => {
    try {
        const userId = request.user?._id;

        const user = await User.findById(userId).populate({
            path: 'savedPrompts',
            populate: {
                path: 'author',
                select: 'username avatar'
            }
        });

        if (!user) {
            response.status(404).json({ message: 'User not found' });
            return;
        }

        response.status(200).json(user.savedPrompts);
    } catch (error: any) {
        response.status(500).json({ message: error.message });
    }
};

export const updateProfile = async (request: Request, response: Response): Promise<void> => {
    try {
        const { username, bio, avatar } = request.body;
        const user = await User.findById(request.user?._id);

        if (!user) {
            response.status(404).json({ message: 'User not found' });
            return;
        }

        if (username) user.username = username;
        if (bio !== undefined) user.bio = bio;
        if (avatar) user.avatar = avatar;

        const updatedUser = await user.save();

        response.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            bio: updatedUser.bio,
            avatar: updatedUser.avatar,
            followers: updatedUser.followers,
            following: updatedUser.following,
        });
    } catch (error: any) {
        if (error.code === 11000) {
            response.status(400).json({ message: 'Username already taken' });
            return;
        }
        response.status(500).json({ message: error.message });
    }
};

export const getFollowers = async (request: Request, response: Response): Promise<void> => {
    try {
        const user = await User.findById(request.params.id).populate('followers', 'username avatar bio');
        if (!user) {
            response.status(404).json({ message: 'User not found' });
            return;
        }
        response.json(user.followers);
    } catch (error: any) {
        response.status(500).json({ message: error.message });
    }
};

export const getFollowing = async (request: Request, response: Response): Promise<void> => {
    try {
        const user = await User.findById(request.params.id).populate('following', 'username avatar bio');
        if (!user) {
            response.status(404).json({ message: 'User not found' });
            return;
        }
        response.json(user.following);
    } catch (error: any) {
        response.status(500).json({ message: error.message });
    }
};
