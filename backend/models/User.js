import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String },
        role: { type: String, enum: ['User', 'Admin'], default: 'User' },
        status: { type: String, enum: ['Active', 'Suspended'], default: 'Active' },
        enrolledCourses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course',
            },
        ],
        courseProgress: [
            {
                course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
                completedLessons: { type: Number, default: 0 },
                percentComplete: { type: Number, default: 0 },
                lastAccessed: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
