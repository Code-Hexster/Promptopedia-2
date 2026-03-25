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
exports.getMe = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const register = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = request.body;
        if (!username || !email || !password) {
            response.status(400).json({ message: 'Please add all fields' });
            return;
        }
        const userExists = yield User_1.default.findOne({ email });
        if (userExists) {
            response.status(400).json({ message: 'User already exists' });
            return;
        }
        const user = yield User_1.default.create({
            username,
            email,
            password,
        });
        if (user) {
            response.status(201).json({
                _id: user.id,
                username: user.username,
                email: user.email,
                token: (0, generateToken_1.default)(user._id),
            });
        }
        else {
            response.status(400).json({ message: 'Invalid user data' });
        }
    }
    catch (error) {
        if (error.code === 11000) {
            response.status(400).json({ message: 'Username or email already exists' });
            return;
        }
        response.status(500).json({ message: error.message });
    }
});
exports.register = register;
const login = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = request.body;
        const user = yield User_1.default.findOne({ email }).select('+password');
        if (user && (yield user.matchPassword(password))) {
            response.json({
                _id: user.id,
                username: user.username,
                email: user.email,
                token: (0, generateToken_1.default)(user._id),
            });
        }
        else {
            response.status(401).json({ message: 'Invalid credentials' });
        }
    }
    catch (error) {
        response.status(500).json({ message: error.message });
    }
});
exports.login = login;
const getMe = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const user = request.user;
    if (!user) {
        response.status(401).json({ message: 'Not authorized' });
        return;
    }
    response.status(200).json({
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        followers: user.followers,
        following: user.following,
    });
});
exports.getMe = getMe;
