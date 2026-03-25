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
exports.deleteComment = exports.getComments = exports.addComment = void 0;
const Comment_1 = __importDefault(require("../models/Comment"));
const Prompt_1 = __importDefault(require("../models/Prompt"));
const Notification_1 = __importDefault(require("../models/Notification"));
const addComment = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { text } = request.body;
        const promptId = request.params.id;
        const userId = (_a = request.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!text) {
            response.status(400).json({ message: 'Please add a comment' });
            return;
        }
        if (!userId) {
            response.status(401).json({ message: 'User not authorized' });
            return;
        }
        const prompt = yield Prompt_1.default.findById(promptId);
        if (!prompt) {
            response.status(404).json({ message: 'Prompt not found' });
            return;
        }
        const comment = yield Comment_1.default.create({
            text,
            prompt: promptId,
            user: userId
        });
        prompt.comments.push(comment._id);
        yield prompt.save();
        if (prompt.author.toString() !== userId.toString()) {
            yield Notification_1.default.create({
                user: prompt.author,
                type: 'comment',
                fromUser: userId,
                promptId: prompt._id
            });
        }
        const populatedComment = yield Comment_1.default.findById(comment._id).populate('user', 'username avatar');
        response.status(201).json(populatedComment);
    }
    catch (error) {
        response.status(500).json({ message: error.message });
    }
});
exports.addComment = addComment;
const getComments = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promptId = request.params.id;
        const comments = yield Comment_1.default.find({ prompt: promptId })
            .populate('user', 'username avatar')
            .sort({ createdAt: -1 });
        response.status(200).json(comments);
    }
    catch (error) {
        response.status(500).json({ message: error.message });
    }
});
exports.getComments = getComments;
const deleteComment = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const comment = yield Comment_1.default.findById(request.params.id);
        if (!comment) {
            response.status(404).json({ message: 'Comment not found' });
            return;
        }
        if (comment.user.toString() !== ((_a = request.user) === null || _a === void 0 ? void 0 : _a._id.toString())) {
            response.status(401).json({ message: 'User not authorized' });
            return;
        }
        yield comment.deleteOne();
        yield Prompt_1.default.findByIdAndUpdate(comment.prompt, {
            $pull: { comments: comment._id }
        });
        response.status(200).json({ message: 'Comment removed' });
    }
    catch (error) {
        response.status(500).json({ message: error.message });
    }
});
exports.deleteComment = deleteComment;
