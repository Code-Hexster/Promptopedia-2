"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get('/saved', auth_middleware_1.protect, user_controller_1.getSavedPrompts);
router.get('/:id', auth_middleware_1.protect, user_controller_1.getProfile);
router.put('/follow/:id', auth_middleware_1.protect, user_controller_1.followUser);
router.put('/save/:id', auth_middleware_1.protect, user_controller_1.savePrompt);
exports.default = router;
