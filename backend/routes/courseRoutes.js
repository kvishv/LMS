import express from 'express';
import { 
    getCourses, getCourseById, getCourseContent, 
    createCourse, updateCourse, deleteCourse, 
    enrollCourse, updateProgress 
} from '../controllers/courseController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { requireEnrollment } from '../middleware/enrollmentMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getCourses)
    .post(protect, admin, createCourse);

router.post('/progress', protect, updateProgress);

router.route('/:id')
    .get(getCourseById)
    .put(protect, admin, updateCourse)
    .delete(protect, admin, deleteCourse);

router.get('/:id/content', protect, requireEnrollment, getCourseContent);
router.post('/:id/enroll', protect, enrollCourse);

export default router;
