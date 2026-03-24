import express from 'express';
import { addComment, getComments, deleteComment } from '../controllers/comment.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/:id') // promptId for GET/POST
    .get(getComments)
    .post(protect, addComment);

router.delete('/:id', protect, deleteComment); // commentId for DELETE

export default router;
