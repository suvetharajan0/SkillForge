import User from '../models/User.js'
import Attempt from '../models/Attempt.js'
import Assessment from '../models/Assessment.js'
import Question from '../models/Question.js'
import Skill from '../models/Skill.js'


export const getStats = async (req, res, next) => {
  try {
    const [userCount, assessmentCount, questionCount, skillCount, attemptCount] = await Promise.all([
      User.countDocuments(),
      Assessment.countDocuments(),
      Question.countDocuments(),
      Skill.countDocuments(),
      Attempt.countDocuments(),
    ])


    const avgResult = await Attempt.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$score' } } },
    ])
    const platformAverageScore = avgResult.length ? Math.round(avgResult[0].avgScore) : 0


    res.json({ userCount, assessmentCount, questionCount, skillCount, attemptCount, platformAverageScore })
  } catch (err) {
    next(err)
  }
}


export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('name email role xp level createdAt').sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    next(err)
  }
}


export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body
    if (!['user', 'admin'].includes(role)) {
      res.status(400)
      throw new Error('Role must be "user" or "admin"')
    }


    const user = await User.findById(req.params.id)
    if (!user) {
      res.status(404)
      throw new Error('User not found')
    }


    if (user._id.toString() === req.user._id.toString()) {
      res.status(400)
      throw new Error('You cannot change your own role')
    }


    user.role = role
    await user.save()
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role })
  } catch (err) {
    next(err)
  }
}


export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      res.status(404)
      throw new Error('User not found')
    }


    if (user._id.toString() === req.user._id.toString()) {
      res.status(400)
      throw new Error('You cannot delete your own account')
    }


    await user.deleteOne()
    res.json({ message: 'User removed' })
  } catch (err) {
    next(err)
  }
}