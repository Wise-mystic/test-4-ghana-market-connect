import express from 'express';
import { getAllLessons, getLessonById, createLesson, updateLesson, deleteLesson } from '../controllers/lesson.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';
import { lessonSchema } from '../validators/lesson.schema.js';

const router = express.Router();

// Public routes
router.get('/', getAllLessons);
router.get('/:id', getLessonById);

// Protected routes
router.post('/', authenticate, authorize('admin'), validateRequest(lessonSchema), createLesson);
router.put('/:id', authenticate, authorize('admin'), validateRequest(lessonSchema), updateLesson);
router.delete('/:id', authenticate, authorize('admin'), deleteLesson);

export default router; 