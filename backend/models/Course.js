import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    duration: { type: Number, required: true },
    description: { type: String },
});

const courseSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        price: { type: Number, required: true },
        maxStudents: { type: Number, required: true },
        enrolledStudents: { type: Number, default: 0 },
        duration: { type: Number, required: true }, // Total duration in hours
        thumbnail: { type: String },
        curriculum: [lessonSchema],
    },
    { timestamps: true }
);

const Course = mongoose.model('Course', courseSchema);
export default Course;
