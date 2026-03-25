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
exports.markMessagesAsSeen = exports.getConversations = exports.getMessages = exports.sendMessage = void 0;
const Message_1 = __importDefault(require("../models/Message"));
const User_1 = __importDefault(require("../models/User"));
const Notification_1 = __importDefault(require("../models/Notification"));
const sendMessage = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { text } = request.body;
        const { id: receiverId } = request.params;
        const senderId = (_a = request.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!text) {
            response.status(400).json({ message: 'Message text is required' });
            return;
        }
        let conversation = yield Message_1.default.create({
            sender: senderId,
            receiver: receiverId,
            text
        });
        yield Notification_1.default.create({
            user: receiverId,
            type: 'message',
            fromUser: senderId,
            isRead: false
        });
        const populatedMessage = yield Message_1.default.findById(conversation._id)
            .populate('sender', 'username avatar')
            .populate('receiver', 'username avatar');
        response.status(201).json(populatedMessage);
    }
    catch (error) {
        response.status(500).json({ message: error.message });
    }
});
exports.sendMessage = sendMessage;
const getMessages = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id: userToChatId } = request.params;
        const senderId = (_a = request.user) === null || _a === void 0 ? void 0 : _a._id;
        const messages = yield Message_1.default.find({
            $or: [
                { sender: senderId, receiver: userToChatId },
                { sender: userToChatId, receiver: senderId }
            ]
        }).sort({ createdAt: 1 });
        response.status(200).json(messages);
    }
    catch (error) {
        response.status(500).json({ message: error.message });
    }
});
exports.getMessages = getMessages;
const getConversations = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const currentUserId = (_a = request.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!currentUserId) {
            response.status(401).json({ message: 'User not authorized' });
            return;
        }
        const messages = yield Message_1.default.find({
            $or: [
                { sender: currentUserId },
                { receiver: currentUserId }
            ]
        }).sort({ createdAt: -1 });
        const userIds = new Set();
        messages.forEach(msg => {
            if (msg.sender.toString() !== currentUserId.toString()) {
                userIds.add(msg.sender.toString());
            }
            if (msg.receiver.toString() !== currentUserId.toString()) {
                userIds.add(msg.receiver.toString());
            }
        });
        const users = yield User_1.default.find({ _id: { $in: Array.from(userIds) } }).select('username avatar');
        response.status(200).json(users);
    }
    catch (error) {
        response.status(500).json({ message: error.message });
    }
});
exports.getConversations = getConversations;
const markMessagesAsSeen = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id: senderId } = request.params;
        const receiverId = (_a = request.user) === null || _a === void 0 ? void 0 : _a._id;
        yield Message_1.default.updateMany({ sender: senderId, receiver: receiverId, seen: false }, { $set: { seen: true } });
        response.status(200).json({ message: 'Messages marked as seen' });
    }
    catch (error) {
        response.status(500).json({ message: error.message });
    }
});
exports.markMessagesAsSeen = markMessagesAsSeen;
