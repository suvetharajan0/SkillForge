import express from 'express'
import { getInsights, generatePracticeQuestions } from '../controllers/aiCoachController.js'
import { protect } from '../middleware/authMiddleware.js'


const router = express.Router()


router.get('/insights', protect, getInsights)
router.post('/practice-questions', protect, generatePracticeQuestions)


export default router