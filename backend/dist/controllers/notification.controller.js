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
exports.markNotificationsRead = exports.getNotifications = void 0;
const Notification_1 = __importDefault(require("../models/Notification"));
const getNotifications = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const notifications = yield Notification_1.default.find({ user: (_a = request.user) === null || _a === void 0 ? void 0 : _a._id })
            .populate('fromUser', 'username avatar')
            .populate('promptId', 'title')
            .sort({ createdAt: -1 });
        response.status(200).json(notifications);
    }
    catch (error) {
        response.status(500).json({ message: error.message });
    }
});
exports.getNotifications = getNotifications;
const markNotificationsRead = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        yield Notification_1.default.updateMany({ user: (_a = request.user) === null || _a === void 0 ? void 0 : _a._id, isRead: false }, { $set: { isRead: true } });
        response.status(200).json({ message: 'Notifications marked as read' });
    }
    catch (error) {
        response.status(500).json({ message: error.message });
    }
});
exports.markNotificationsRead = markNotificationsRead;
