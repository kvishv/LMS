import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
        amount: { type: Number, required: true }, // Should be stored in paise
        currency: { type: String, default: 'INR' },
        razorpayOrderId: { type: String, required: true },
        razorpayPaymentId: { type: String },
        razorpaySignature: { type: String },
        status: {
            type: String,
            enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
            default: 'PENDING',
        },
        refund: {
            reason: { type: String },
            status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'] },
            processedAt: { type: Date },
        },
    },
    { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
