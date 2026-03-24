import express from 'express';
import { createPrompt, getPrompts, getPromptById, deletePrompt, getUserPrompts, likePrompt, getFollowingPrompts, searchPrompts } from '../controllers/prompt.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/create', protect, createPrompt);
router.get('/feed', getPrompts);
router.get('/following', protect, getFollowingPrompts);
router.get('/user/:id', getUserPrompts);
router.delete('/:id', protect, deletePrompt);
router.put('/like/:id', protect, likePrompt);
router.get('/search', getPrompts); // Base getPrompts can handle no query, specific search is below if needed, or update getPrompts. 
// Actually I implemented searchPrompts separately.
router.get('/search/tags', searchPrompts);
router.get('/:id', getPromptById);

export default router;
