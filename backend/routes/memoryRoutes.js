import express from 'express';
import {
  getMemories,
  getMemoryById,
  createMemory,
  likeMemory,
} from '../controllers/memoryController.js';

const router = express.Router();

router.get('/', getMemories);
router.get('/:id', getMemoryById);
router.post('/', createMemory);
router.post('/:id/like', likeMemory);
export default router;


