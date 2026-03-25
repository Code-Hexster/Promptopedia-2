"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const message_controller_1 = require("../controllers/message.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get('/conversations', auth_middleware_1.protect, message_controller_1.getConversations);
router.get('/:id', auth_middleware_1.protect, message_controller_1.getMessages);
router.post('/send/:id', auth_middleware_1.protect, message_controller_1.sendMessage);
router.put('/seen/:id', auth_middleware_1.protect, message_controller_1.markMessagesAsSeen);
exports.default = router;
