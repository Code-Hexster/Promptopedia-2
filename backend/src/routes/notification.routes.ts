import express from 'express';
import { getNotifications, markNotificationsRead } from '../controllers/notification.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', protect, getNotifications);
router.put('/read', protect, markNotificationsRead);

export default router;
