import Course from '../models/Course.js';

export const requireEnrollment = async (req, res, next) => {
    try {
        const courseId = req.params.id;
        
        // Admin can access everything
        if (req.user.role === 'Admin') {
            return next();
        }

        const isEnrolled = req.user.enrolledCourses.includes(courseId);
        
        if (!isEnrolled) {
            return res.status(403).json({ message: 'Access denied: You must be enrolled in this course to view content' });
        }
        
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error checking enrollment status' });
    }
};
