import express from 'express';
const router = express.Router();
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
} from '../controllers/userController.js';
import protect from '../middlewares/authMiddleware.js';
router.route('/')
  .post(protect, createUser)
  .get(protect, getUsers);
router.route('/:id')
  .get(protect, getUserById)
  .put(protect, updateUser);

export default router;