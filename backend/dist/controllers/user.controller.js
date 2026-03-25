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
exports.getSavedPrompts = exports.savePrompt = exports.followUser = exports.getProfile = void 0;
const User_1 = __importDefault(require("../models/User"));
const Prompt_1 = __importDefault(require("../models/Prompt"));
const Notification_1 = __importDefault(require("../models/Notification"));
const getProfile = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(request.params.id).select('-password');
        if (!user) {
            response.status(404).json({ message: 'User not found' });
            return;
        }
        const prompts = yield Prompt_1.default.find({ author: user._id }).sort({ createdAt: -1 });
        response.json({ user, prompts });
    }
    catch (error) {
        response.status(500).json({ message: error.message });
    }
});
exports.getProfile = getProfile;
const followUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userToFollow = yield User_1.default.findById(request.params.id);
        const currentUser = yield User_1.default.findById((_a = request.user) === null || _a === void 0 ? void 0 : _a._id);
        if (!userToFollow || !currentUser) {
            response.status(404).json({ message: 'User not found' });
            return;
        }
        if (userToFollow._id.toString() === currentUser._id.toString()) {
            response.status(400).json({ message: 'You cannot follow yourself' });
            return;
        }
        if (userToFollow.followers.includes(currentUser._id)) {
            userToFollow.followers = userToFollow.followers.filter((id) => id.toString() !== currentUser._id.toString());
            currentUser.following = currentUser.following.filter((id) => id.toString() !== userToFollow._id.toString());
            yield userToFollow.save();
            yield currentUser.save();
            response.json({ message: 'User unfollowed', isFollowing: false });
        }
        else {
            // Follow
            userToFollow.followers.push(currentUser._id);
            currentUser.following.push(userToFollow._id);
            yield userToFollow.save();
            yield currentUser.save();
            yield Notification_1.default.create({
                user: userToFollow._id,
                type: 'follow',
                fromUser: currentUser._id
            });
            response.json({ message: 'User followed', isFollowing: true });
        }
    }
    catch (error) {
        response.status(500).json({ message: error.message });
    }
});
exports.followUser = followUser;
const savePrompt = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = request.params;
        const userId = (_a = request.user) === null || _a === void 0 ? void 0 : _a._id;
        const user = yield User_1.default.findById(userId);
        if (!user) {
            response.status(404).json({ message: 'User not found' });
            return;
        }
        const isSaved = user.savedPrompts.includes(id);
        if (isSaved) {
            yield User_1.default.findByIdAndUpdate(userId, { $pull: { savedPrompts: id } });
            response.status(200).json({ message: 'Prompt unsaved' });
        }
        else {
            yield User_1.default.findByIdAndUpdate(userId, { $push: { savedPrompts: id } });
            response.status(200).json({ message: 'Prompt saved' });
        }
    }
    catch (error) {
        response.status(500).json({ message: error.message });
    }
});
exports.savePrompt = savePrompt;
const getSavedPrompts = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = request.user) === null || _a === void 0 ? void 0 : _a._id;
        const user = yield User_1.default.findById(userId).populate({
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
    }
    catch (error) {
        response.status(500).json({ message: error.message });
    }
});
exports.getSavedPrompts = getSavedPrompts;
