import express from 'express';
import {
  addComment,
  deleteComment,
} from '../controllers/commentController.js';

const router = express.Router();

router.post('/:memoryId/comments', addComment);
router.delete('/:id', deleteComment);

export default router;