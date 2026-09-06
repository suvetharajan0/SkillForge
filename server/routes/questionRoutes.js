import express from 'express'
import {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} from '../controllers/questionController.js'
import { protect, admin } from '../middleware/authMiddleware.js'


const router = express.Router()

router.route('/')
  .get(getQuestions)
  .post(protect, admin, createQuestion)

router.route('/:id')
  .get(getQuestionById)
  .put(protect, admin, updateQuestion)
  .delete(protect, admin, deleteQuestion)


export default router