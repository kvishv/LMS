import Coupon from '../models/Coupon.js';

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = async (req, res) => {
    try {
        const { code, discountType, discountValue, maxDiscount, usageLimit, perUserLimit, applicableCourses, expiresAt } = req.body;

        if (discountType === 'percentage' && discountValue > 100) {
            return res.status(400).json({ message: 'Percentage discount cannot exceed 100' });
        }

        const coupon = new Coupon({
            code, discountType, discountValue, maxDiscount, usageLimit, perUserLimit, applicableCourses, expiresAt
        });

        const createdCoupon = await coupon.save();
        res.status(201).json(createdCoupon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
export const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({});
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (coupon) {
            res.json({ message: 'Coupon removed' });
        } else {
            res.status(404).json({ message: 'Coupon not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
// @access  Private
export const validateCoupon = async (req, res) => {
    try {
        const { code, courseId } = req.body;
        const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

        if (!coupon) return res.status(404).json({ message: 'Invalid or inactive coupon' });
        
        if (new Date() > coupon.expiresAt) return res.status(400).json({ message: 'Coupon has expired' });

        // Total usage check
        const totalUses = coupon.usageHistory.length;
        if (totalUses >= coupon.usageLimit) return res.status(400).json({ message: 'Coupon usage limit reached' });

        // Per user limit check
        const userUses = coupon.usageHistory.filter(h => h.user.toString() === req.user._id.toString()).length;
        if (userUses >= coupon.perUserLimit) return res.status(400).json({ message: 'You have exhausted your usage limit for this coupon' });

        // Course applicability
        if (coupon.applicableCourses && coupon.applicableCourses.length > 0) {
             const isApplicable = coupon.applicableCourses.some(id => id.toString() === courseId);
             if(!isApplicable) return res.status(400).json({ message: 'Coupon is not applicable to this course' });
        }

        res.json({
             message: 'Coupon is valid',
             discountType: coupon.discountType,
             discountValue: coupon.discountValue,
             maxDiscount: coupon.maxDiscount,
             couponId: coupon._id
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Apply coupon (records usage)
// @route   POST /api/coupons/apply
// @access  Private
export const applyCoupon = async (req, res) => {
     try {
         const { couponId, discountApplied } = req.body;
         const coupon = await Coupon.findById(couponId);
         
         if(coupon) {
              coupon.usageHistory.push({
                   user: req.user._id,
                   discountApplied
              });
              await coupon.save();
              res.json({ message: 'Coupon applied successfully' });
         } else {
              res.status(404).json({ message: 'Coupon not found' });
         }
     } catch (error) {
          res.status(500).json({ message: error.message });
     }
}
