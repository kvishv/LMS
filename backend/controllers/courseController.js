import Course from '../models/Course.js';
import User from '../models/User.js';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({}).select('-curriculum.videoUrl'); // Hide videos from public
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).select('-curriculum.videoUrl');
        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get course content (requires auth & enrollment)
// @route   GET /api/courses/:id/content
// @access  Private (Enrolled students & Admins)
export const getCourseContent = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Admin
export const createCourse = async (req, res) => {
    try {
        const course = new Course(req.body);
        const createdCourse = await course.save();
        res.status(201).json(createdCourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
export const updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (course) {
            Object.assign(course, req.body);
            const updatedCourse = await course.save();
            res.json(updatedCourse);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
export const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (course) {
            res.json({ message: 'Course removed' });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Enroll in a course (often used directly without payment if free, or by the payment gateway)
// @route   POST /api/courses/:id/enroll
// @access  Private
// NOTE: For paid courses, payment logic handles this. We use this directly for testing/free.
export const enrollCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        const user = await User.findById(req.user._id);

        if (!course) return res.status(404).json({ message: 'Course not found' });

        // Check capacity
        if (course.enrolledStudents >= course.maxStudents) {
            return res.status(400).json({ message: 'Course is full' });
        }

        // Check if already enrolled
        if (user.enrolledCourses.includes(course._id)) {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }

        user.enrolledCourses.push(course._id);
        user.courseProgress.push({ course: course._id, completedLessons: 0, percentComplete: 0 });
        await user.save();

        course.enrolledStudents += 1;
        await course.save();

        res.json({ message: 'Successfully enrolled' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update course progress
// @route   POST /api/courses/progress
// @access  Private
export const updateProgress = async (req, res) => {
     try {
        const { courseId, completedLessons } = req.body;
        const user = await User.findById(req.user._id);
        const course = await Course.findById(courseId);

        if(!course) return res.status(404).json({message: 'Course not found'});

        const progressIndex = user.courseProgress.findIndex(p => p.course.toString() === courseId);
        
        if (progressIndex !== -1) {
            const totalLessons = course.curriculum.length || 1;
            const percentComplete = Math.round((completedLessons / totalLessons) * 100);

            user.courseProgress[progressIndex].completedLessons = completedLessons;
            user.courseProgress[progressIndex].percentComplete = percentComplete;
            user.courseProgress[progressIndex].lastAccessed = Date.now();
            
            await user.save();
            res.json({ message: 'Progress updated', progress: user.courseProgress[progressIndex] });
        } else {
            res.status(400).json({ message: 'User not enrolled in course' });
        }
     } catch (error) {
        res.status(500).json({ message: error.message });
     }
}
