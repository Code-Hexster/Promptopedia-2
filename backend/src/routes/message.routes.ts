import express from 'express';
import { sendMessage, getMessages, getConversations, markMessagesAsSeen } from '../controllers/message.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/conversations', protect, getConversations);
router.get('/:id', protect, getMessages);
router.post('/send/:id', protect, sendMessage);
router.put('/seen/:id', protect, markMessagesAsSeen);

export default router;
