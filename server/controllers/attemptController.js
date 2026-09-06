import Attempt from '../models/Attempt.js'


// @desc  Get the logged-in user's attempt history
// @route GET /api/attempts
export const getMyAttempts = async (req, res, next) => {
  try {
    const attempts = await Attempt.find({ user: req.user._id })
      .populate('assessment', 'title')
      .populate('skill', 'name category')
      .sort({ createdAt: -1 })


    res.json(attempts)
  } catch (err) {
    next(err)
  }
}


// @desc  Get average score per skill for the logged-in user
// @route GET /api/attempts/performance
export const getPerformanceBySkill = async (req, res, next) => {
  try {
    const performance = await Attempt.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$skill',
          averageScore: { $avg: '$score' },
          attemptsCount: { $sum: 1 },
          bestScore: { $max: '$score' },
        },
      },
      {
        $lookup: {
          from: 'skills',
          localField: '_id',
          foreignField: '_id',
          as: 'skillInfo',
        },
      },
      { $unwind: '$skillInfo' },
      {
        $project: {
          _id: 0,
          skillId: '$_id',
          skillName: '$skillInfo.name',
          category: '$skillInfo.category',
          averageScore: { $round: ['$averageScore', 0] },
          attemptsCount: 1,
          bestScore: 1,
        },
      },
      { $sort: { averageScore: -1 } },
    ])


    res.json(performance)
  } catch (err) {
    next(err)
  }
}


// @desc  Get one specific attempt in full detail
// @route GET /api/attempts/:id
export const getAttemptById = async (req, res, next) => {
  try {
    const attempt = await Attempt.findById(req.params.id)
      .populate('assessment', 'title passingScore')
      .populate('skill', 'name category')
      .populate('answers.question', 'questionText options explanation')


    if (!attempt) {
      res.status(404)
      throw new Error('Attempt not found')
    }


    if (attempt.user.toString() !== req.user._id.toString()) {
      res.status(403)
      throw new Error('Not authorized to view this attempt')
    }


    res.json(attempt)
  } catch (err) {
    next(err)
  }
}