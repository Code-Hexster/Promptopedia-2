"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prompt_controller_1 = require("../controllers/prompt.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.post('/create', auth_middleware_1.protect, prompt_controller_1.createPrompt);
router.get('/feed', prompt_controller_1.getPrompts);
router.get('/following', auth_middleware_1.protect, prompt_controller_1.getFollowingPrompts);
router.get('/user/:id', prompt_controller_1.getUserPrompts);
router.delete('/:id', auth_middleware_1.protect, prompt_controller_1.deletePrompt);
router.put('/like/:id', auth_middleware_1.protect, prompt_controller_1.likePrompt);
router.get('/search', prompt_controller_1.getPrompts); // Base getPrompts can handle no query, specific search is below if needed, or update getPrompts. 
// Actually I implemented searchPrompts separately.
router.get('/search/tags', prompt_controller_1.searchPrompts);
router.get('/:id', prompt_controller_1.getPromptById);
exports.default = router;
