import Question from '../models/Question.js'
import Skill from '../models/Skill.js'
import Assessment from '../models/Assessment.js'


// @desc  Create a new question
// @route POST /api/questions
export const createQuestion = async (req, res, next) => {
  try {
    const { skill, questionText, options, correctAnswerIndex, difficulty, explanation } = req.body


    if (!skill || !questionText || !options || correctAnswerIndex === undefined) {
      res.status(400)
      throw new Error('Please provide skill, questionText, options, and correctAnswerIndex')
    }


    const skillExists = await Skill.findById(skill)
    if (!skillExists) {
      res.status(400)
      throw new Error('Referenced skill does not exist')
    }


    if (correctAnswerIndex < 0 || correctAnswerIndex >= options.length) {
      res.status(400)
      throw new Error('correctAnswerIndex must point to a valid option')
    }


    const question = await Question.create({
      skill,
      questionText,
      options,
      correctAnswerIndex,
      difficulty,
      explanation,
    })


    res.status(201).json(question)
  } catch (err) {
    next(err)
  }
}


// @desc  Get all questions (optionally filtered by skill or difficulty)
// @route GET /api/questions?skill=<id>&difficulty=easy
export const getQuestions = async (req, res, next) => {
  try {
    const filter = {}
    if (req.query.skill) filter.skill = req.query.skill
    if (req.query.difficulty) filter.difficulty = req.query.difficulty


    const questions = await Question.find(filter).populate('skill', 'name category')
    res.json(questions)
  } catch (err) {
    next(err)
  }
}


// @desc  Get a single question by id
// @route GET /api/questions/:id
export const getQuestionById = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id).populate('skill', 'name category')


    if (!question) {
      res.status(404)
      throw new Error('Question not found')
    }


    res.json(question)
  } catch (err) {
    next(err)
  }
}


// @desc  Update a question
// @route PUT /api/questions/:id
export const updateQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id)


    if (!question) {
      res.status(404)
      throw new Error('Question not found')
    }


    question.skill = req.body.skill ?? question.skill
    question.questionText = req.body.questionText ?? question.questionText
    question.options = req.body.options ?? question.options
    question.correctAnswerIndex = req.body.correctAnswerIndex ?? question.correctAnswerIndex
    question.difficulty = req.body.difficulty ?? question.difficulty
    question.explanation = req.body.explanation ?? question.explanation


    const updatedQuestion = await question.save()
    res.json(updatedQuestion)
  } catch (err) {
    next(err)
  }
}


// @desc  Delete a question
// @route DELETE /api/questions/:id
export const deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id)


    if (!question) {
      res.status(404)
      throw new Error('Question not found')
    }


    const assessmentCount = await Assessment.countDocuments({ questions: question._id })


    if (assessmentCount > 0) {
      res.status(400)
      throw new Error(
        `Cannot delete this question — it's used by ${assessmentCount} assessment(s). Remove it from those assessments first.`
      )
    }


    await question.deleteOne()
    res.json({ message: 'Question removed' })
  } catch (err) {
    next(err)
  }
}