import express from 'express'
import { getAchievements } from '../controllers/achievementController.js'
import { protect } from '../middleware/authMiddleware.js'


const router = express.Router()
router.get('/', protect, getAchievements)


export default router