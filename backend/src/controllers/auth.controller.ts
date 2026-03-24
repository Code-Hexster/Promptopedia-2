import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import generateToken from '../utils/generateToken';


export const register = async (request: Request, response: Response): Promise<void> => {
    console.log('Register request received:', request.body);
    try {
        const { username, email, password } = request.body;

        if (!username || !email || !password) {
            console.log('Register error: Missing fields');
            response.status(400).json({ message: 'Please add all fields' });
            return;
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log('Register error: User exists');
            response.status(400).json({ message: 'User already exists' });
            return;
        }

        const user = await User.create({
            username,
            email,
            password,
        });

        if (user) {
            console.log('Register success:', user._id);
            response.status(201).json({
                _id: user.id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            console.log('Register error: Invalid user data');
            response.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error: any) {
        console.error('Register exception:', error);
        if (error.code === 11000) {
            response.status(400).json({ message: 'Username or email already exists' });
            return;
        }
        response.status(500).json({ message: error.message });
    }
};


export const login = async (request: Request, response: Response): Promise<void> => {
    try {
        const { email, password } = request.body;


        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            response.json({
                _id: user.id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            response.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error: any) {
        response.status(500).json({ message: error.message });
    }
};


export const getMe = async (request: Request, response: Response): Promise<void> => {
    const user = request.user;

    if (!user) {
        response.status(401).json({ message: 'Not authorized' });
        return;
    }

    response.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        followers: user.followers,
        following: user.following,
    });
};
