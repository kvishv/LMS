import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import Course from '../models/Course.js';
import User from '../models/User.js';

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'test_key',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_secret',
});

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private
export const createOrder = async (req, res) => {
    try {
        const { courseId } = req.body;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const amountInPaise = course.price * 100;

        const options = {
            amount: amountInPaise,
            currency: 'INR',
            receipt: `rcpt_${req.user._id}_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        // Create pending payment record
        const payment = new Payment({
            user: req.user._id,
            course: courseId,
            amount: amountInPaise,
            razorpayOrderId: order.id,
            status: 'PENDING',
        });
        await payment.save();

        res.json({ order, paymentId: payment._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify
// @access  Private
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'test_secret')
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
             // Payment is successful
             const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
             if(payment){
                 payment.status = 'COMPLETED';
                 payment.razorpayPaymentId = razorpay_payment_id;
                 payment.razorpaySignature = razorpay_signature;
                 await payment.save();
             }

             // Enroll the user
             const user = await User.findById(req.user._id);
             const course = await Course.findById(courseId);

             if(user && course && !user.enrolledCourses.includes(courseId)){
                 user.enrolledCourses.push(courseId);
                 user.courseProgress.push({ course: courseId, completedLessons: 0, percentComplete: 0 });
                 await user.save();
                 
                 course.enrolledStudents += 1;
                 await course.save();
             }

             res.json({ message: 'Payment verified successfully and enrolled in course' });
        } else {
             res.status(400).json({ message: 'Invalid payment signature' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user payment history
// @route   GET /api/payments
// @access  Private
export const getPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.user._id }).populate('course', 'title');
        res.json(payments);
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
};
