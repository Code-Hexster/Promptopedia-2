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
exports.searchPrompts = exports.getFollowingPrompts = exports.likePrompt = exports.getUserPrompts = exports.deletePrompt = exports.getPromptById = exports.getPrompts = exports.createPrompt = void 0;
const Prompt_1 = __importDefault(require("../models/Prompt"));
const User_1 = __importDefault(require("../models/User"));
const Notification_1 = __importDefault(require("../models/Notification"));
const createPrompt = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, promptText, modelUsed, outputImage, outputText, tags } = request.body;
        const user = request.user;
        if (!title || !promptText || !modelUsed) {
            response.status(400).json({ message: 'Please provide all required fields' });
            return;
        }
        const prompt = yield Prompt_1.default.create({
            author: user === null || user === void 0 ? void 0 : user._id,
            title,
            promptText,
            modelUsed,
            outputImage,
            outputText,
            tags
        });
        yield User_1.default.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, {
            $push: { prompts: prompt._id }
        });
        response.status(201).json(prompt);
    }
    catch (error) {
        response.status(500).json({ message: error.message });
    }
});
exports.createPrompt = createPrompt;
const getPrompts = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prompts = yield Prompt_1.default.find()
            .populate('author', 'username avatar')
            .sort({ createdAt: -1 });
        response.status(200).json(prompts);
    }
    catch (error) {
        response.status(500).json({ message: error.message });
    }
});
exports.getPrompts = getPrompts;
const getPromptById = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prompt = yield Prompt_1.default.findById(request.params.id)
            .populate('author', 'username avatar');
        if (!prompt) {
            response.status(404).json({ message: 'Prompt not found' });
            return;
        }
        response.status(200).json(prompt);
    }
    catch (error) {
        response.status(500).json({ message: error.message });
    }
});
exports.getPromptById = getPromptById;
const deletePrompt = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const prompt = yield Prompt_1.default.findById(request.params.id);
        if (!prompt) {
            response.status(404).json({ message: 'Prompt not found' });
            return;
        }
        if (prompt.author.toString() !== ((_a = request.user) === null || _a === void 0 ? void 0 : _a._id.toString())) {
            response.status(401).json({ message: 'User not authorized' });
            return;
        }
        yield prompt.deleteOne();
        response.status(200).json({ message: 'Prompt removed' });
    }
    catch (error) {
        response.status(500).json({ message: error.message });
    }
});
exports.deletePrompt = deletePrompt;
const getUserPrompts = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prompts = yield Prompt_1.default.find({ author: request.params.id })
            .populate('author', 'username avatar')
            .sort({ createdAt: -1 });
        response.status(200).json(prompts);
    }
    catch (error) {
        response.status(500).json({ message: error.message });
    }
});
exports.getUserPrompts = getUserPrompts;
const likePrompt = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const prompt = yield Prompt_1.default.findById(request.params.id);
        if (!prompt) {
            response.status(404).json({ message: 'Prompt not found' });
            return;
        }
        const userId = (_a = request.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            response.status(401).json({ message: 'User not authorized' });
            return;
        }
        if (prompt.likes.includes(userId)) {
            prompt.likes = prompt.likes.filter(id => id.toString() !== userId.toString());
        }
        else {
            prompt.likes.push(userId);
            if (prompt.author.toString() !== userId.toString()) {
                yield Notification_1.default.create({
                    user: prompt.author,
                    type: 'like',
                    fromUser: userId,
                    promptId: prompt._id
                });
            }
        }
        yield prompt.save();
        response.status(200).json(prompt.likes);
    }
    catch (error) {
        response.status(500).json({ message: error.message });
    }
});
exports.likePrompt = likePrompt;
const getFollowingPrompts = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield User_1.default.findById((_a = request.user) === null || _a === void 0 ? void 0 : _a._id);
        if (!user) {
            response.status(404).json({ message: 'User not found' });
            return;
        }
        const prompts = yield Prompt_1.default.find({ author: { $in: user.following } })
            .populate('author', 'username avatar')
            .sort({ createdAt: -1 });
        response.status(200).json(prompts);
    }
    catch (error) {
        response.status(500).json({ message: error.message });
    }
});
exports.getFollowingPrompts = getFollowingPrompts;
const searchPrompts = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = request.query;
        let prompts;
        if (query) {
            prompts = yield Prompt_1.default.find({
                tags: { $regex: query, $options: 'i' }
            })
                .populate('author', 'username avatar')
                .sort({ createdAt: -1 });
        }
        else {
            prompts = yield Prompt_1.default.find()
                .populate('author', 'username avatar')
                .sort({ createdAt: -1 });
        }
        response.status(200).json(prompts);
    }
    catch (error) {
        response.status(500).json({ message: error.message });
    }
});
exports.searchPrompts = searchPrompts;
