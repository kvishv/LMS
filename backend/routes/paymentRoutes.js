import express from 'express';
import { createOrder, verifyPayment, getPayments } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getPayments);
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);

export default router;
