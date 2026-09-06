import express from 'express'
import { getMyAttempts, getPerformanceBySkill, getAttemptById } from '../controllers/attemptController.js'
import { protect } from '../middleware/authMiddleware.js'


const router = express.Router()


router.get('/', protect, getMyAttempts)
router.get('/performance', protect, getPerformanceBySkill)
router.get('/:id', protect, getAttemptById)


export default router