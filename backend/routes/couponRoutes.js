import express from 'express';
import { createCoupon, getCoupons, deleteCoupon, validateCoupon, applyCoupon } from '../controllers/couponController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, admin, createCoupon)
    .get(protect, admin, getCoupons);

router.post('/validate', protect, validateCoupon);
router.post('/apply', protect, applyCoupon);
    
router.route('/:id').delete(protect, admin, deleteCoupon);

export default router;
