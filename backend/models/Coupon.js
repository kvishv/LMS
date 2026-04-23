import mongoose from 'mongoose';

const usageHistorySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    discountApplied: { type: Number, required: true },
    appliedAt: { type: Date, default: Date.now },
});

const couponSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true, uppercase: true },
        discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
        discountValue: { type: Number, required: true }, // e.g., 20 (%) or 500 (fixed amount)
        maxDiscount: { type: Number }, // Maximum cap for percentage discounts
        usageLimit: { type: Number, required: true }, // Total times it can be used across all users
        perUserLimit: { type: Number, required: true, default: 1 }, // Max times a single user can use it
        applicableCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // If empty, applies to all
        usageHistory: [usageHistorySchema],
        expiresAt: { type: Date, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
