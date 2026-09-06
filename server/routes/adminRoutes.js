import express from 'express'
import { getStats, getAllUsers, updateUserRole, deleteUser } from '../controllers/adminController.js'
import { protect, admin } from '../middleware/authMiddleware.js'


const router = express.Router()


router.use(protect, admin)


router.get('/stats', getStats)
router.get('/users', getAllUsers)
router.put('/users/:id/role', updateUserRole)
router.delete('/users/:id', deleteUser)


export default router