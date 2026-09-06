import express from 'express'
import {
  createAssessment,
  getAssessments,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
  submitAssessment
} from '../controllers/assessmentController.js'
import { protect, admin } from '../middleware/authMiddleware.js'


const router = express.Router()

router.route('/')
  .get(getAssessments)
  .post(protect, admin, createAssessment)


router.route('/:id')
  .get(getAssessmentById)
  .put(protect, admin, updateAssessment)
  .delete(protect, admin, deleteAssessment)


router.post('/:id/submit', protect, submitAssessment)

export default router