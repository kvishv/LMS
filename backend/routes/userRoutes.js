import express from 'express';
import { getUsers, getUserById, updateUserStatus, updateUserRole, deleteUser } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getUsers);
router.route('/:id').get(protect, admin, getUserById).delete(protect, admin, deleteUser);
router.route('/:id/status').put(protect, admin, updateUserStatus);
router.route('/:id/role').put(protect, admin, updateUserRole);

export default router;
