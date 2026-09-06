import express from 'express'
import { getLeaderboard } from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'


const router = express.Router()
router.get('/leaderboard', protect, getLeaderboard)


export default router