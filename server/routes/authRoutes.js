import express from 'express'
import { registerUser, loginUser, getMe, forgotPassword, resetPassword } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'
import { authLimiter, passwordResetLimiter } from '../middleware/rateLimiter.js'


const router = express.Router()


router.post('/register', authLimiter, registerUser)
router.post('/login', authLimiter, loginUser)
router.get('/me', protect, getMe)
router.post('/forgot-password', passwordResetLimiter, forgotPassword)
router.put('/reset-password/:userId/:token', resetPassword)

export default router