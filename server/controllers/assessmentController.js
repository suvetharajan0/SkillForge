import Assessment from '../models/Assessment.js'
import Skill from '../models/Skill.js'
import Question from '../models/Question.js'
import Attempt from '../models/Attempt.js'
import { calculateLevel, calculateXpGain, updateStreak } from '../utils/gamification.js' 
import { checkAndUnlockAchievements } from './achievementController.js'

// @desc  Create a new assessment
// @route POST /api/assessments
export const createAssessment = async (req, res, next) => {
  try {
    const { title, description, skill, questions, difficulty, timeLimit, passingScore } = req.body


    if (!title || !skill || !questions || !timeLimit) {
      res.status(400)
      throw new Error('Please provide title, skill, questions, and timeLimit')
    }


    const skillExists = await Skill.findById(skill)
    if (!skillExists) {
      res.status(400)
      throw new Error('Referenced skill does not exist')
    }


    if (!Array.isArray(questions) || questions.length === 0) {
      res.status(400)
      throw new Error('An assessment must contain at least one question')
    }


    // Confirm every referenced question ID actually exists
    const foundQuestions = await Question.find({ _id: { $in: questions } })
    if (foundQuestions.length !== questions.length) {
      res.status(400)
      throw new Error('One or more referenced questions do not exist')
    }


    const assessment = await Assessment.create({
      title,
      description,
      skill,
      questions,
      difficulty,
      timeLimit,
      passingScore,
    })


    res.status(201).json(assessment)
  } catch (err) {
    next(err)
  }
}


// @desc  Get all assessments (optionally filtered by skill or difficulty)
// @route GET /api/assessments?skill=<id>&difficulty=easy
export const getAssessments = async (req, res, next) => {
  try {
    const filter = {}
    if (req.query.skill) filter.skill = req.query.skill
    if (req.query.difficulty) filter.difficulty = req.query.difficulty


    // For the list view, we only need question COUNT, not full question data
    const assessments = await Assessment.find(filter)
      .populate('skill', 'name category')
      .select('-questions')
      .lean()


    // Manually attach a question count without pulling full question documents
    const withCounts = await Promise.all(
      assessments.map(async (a) => {
        const count = await Assessment.findById(a._id).select('questions')
        return { ...a, questionCount: count.questions.length }
      })
    )


    res.json(withCounts)
  } catch (err) {
    next(err)
  }
}


// @desc  Get a single assessment with full question detail
// @route GET /api/assessments/:id
export const getAssessmentById = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate('skill', 'name category')
      .populate({
        path: 'questions',
        select: '-correctAnswerIndex -explanation',
        populate: { path: 'skill', select: 'name category' },
      })


    if (!assessment) {
      res.status(404)
      throw new Error('Assessment not found')
    }


    res.json(assessment)
  } catch (err) {
    next(err)
  }
}


// @desc  Update an assessment
// @route PUT /api/assessments/:id
export const updateAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id)


    if (!assessment) {
      res.status(404)
      throw new Error('Assessment not found')
    }


    assessment.title = req.body.title ?? assessment.title
    assessment.description = req.body.description ?? assessment.description
    assessment.skill = req.body.skill ?? assessment.skill
    assessment.questions = req.body.questions ?? assessment.questions
    assessment.difficulty = req.body.difficulty ?? assessment.difficulty
    assessment.timeLimit = req.body.timeLimit ?? assessment.timeLimit
    assessment.passingScore = req.body.passingScore ?? assessment.passingScore


    const updatedAssessment = await assessment.save()
    res.json(updatedAssessment)
  } catch (err) {
    next(err)
  }
}


// @desc  Delete an assessment
// @route DELETE /api/assessments/:id
export const deleteAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id)


    if (!assessment) {
      res.status(404)
      throw new Error('Assessment not found')
    }


    await assessment.deleteOne()
    res.json({ message: 'Assessment removed' })
  } catch (err) {
    next(err)
  }
}

// @desc  Submit answers for grading (does not persist an attempt yet — see Phase 6)
// @route POST /api/assessments/:id/submit
export const submitAssessment = async (req, res, next) => {
  try {
    const { answers } = req.body // [{ questionId, selectedIndex }]


    if (!Array.isArray(answers) || answers.length === 0) {
      res.status(400)
      throw new Error('Please provide your answers')
    }


    const assessment = await Assessment.findById(req.params.id).populate('questions')


    if (!assessment) {
      res.status(404)
      throw new Error('Assessment not found')
    }


    let correctCount = 0


    const results = assessment.questions.map((question) => {
      const submitted = answers.find((a) => a.questionId === question._id.toString())
      const selectedIndex = submitted ? submitted.selectedIndex : null
      const isCorrect = selectedIndex === question.correctAnswerIndex
      if (isCorrect) correctCount++


      return {
        questionId: question._id,
        questionText: question.questionText,
        options: question.options,
        selectedIndex,
        correctIndex: question.correctAnswerIndex,
        isCorrect,
        explanation: question.explanation,
      }
    })

const totalQuestions = assessment.questions.length
    const score = Math.round((correctCount / totalQuestions) * 100)
    const passed = score >= assessment.passingScore

    const attempt = await Attempt.create({
      user: req.user._id,
      assessment: assessment._id,
      skill: assessment.skill,
      score,
      correctCount,
      totalQuestions,
      passed,
      answers: results.map((r) => ({
        question: r.questionId,
        selectedIndex: r.selectedIndex,
        correctIndex: r.correctIndex,
        isCorrect: r.isCorrect,
      })),
    })


    // Gamification: XP, level, streak, achievements
    const xpGained = calculateXpGain(correctCount, passed)
    req.user.xp += xpGained
    req.user.level = calculateLevel(req.user.xp)
    updateStreak(req.user)


    const newlyUnlockedAchievements = await checkAndUnlockAchievements(req.user)
    await req.user.save()


    res.json({
      attemptId: attempt._id,
      assessmentTitle: assessment.title,
      totalQuestions,
      correctCount,
      score,
      passingScore: assessment.passingScore,
      passed,
      results,
      xpGained,
      newXp: req.user.xp,
      newLevel: req.user.level,
      streak: req.user.streak,
      newlyUnlockedAchievements,
    })

  } catch (err) {
    next(err)
  }
}
