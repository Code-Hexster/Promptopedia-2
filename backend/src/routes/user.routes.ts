import express from 'express';
import { getProfile, followUser, savePrompt, getSavedPrompts, updateProfile, getFollowers, getFollowing } from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/saved', protect, getSavedPrompts);
router.put('/update', protect, updateProfile);
router.get('/:id', protect, getProfile);
router.get('/:id/followers', protect, getFollowers);
router.get('/:id/following', protect, getFollowing);
router.put('/follow/:id', protect, followUser);
router.put('/save/:id', protect, savePrompt);

export default router;
