import Achievement from '../models/Achievement.js'
import Attempt from '../models/Attempt.js'


// @desc  Get all achievements with unlocked status for the logged-in user
// @route GET /api/achievements
export const getAchievements = async (req, res, next) => {
  try {
    const achievements = await Achievement.find().sort({ 'criteria.value': 1 })


    const withStatus = achievements.map((a) => {
      const unlocked = req.user.unlockedAchievements.find(
        (u) => u.achievement.toString() === a._id.toString()
      )
      return {
        _id: a._id,
        key: a.key,
        title: a.title,
        description: a.description,
        icon: a.icon,
        unlocked: !!unlocked,
        unlockedAt: unlocked ? unlocked.unlockedAt : null,
      }
    })


    res.json(withStatus)
  } catch (err) {
    next(err)
  }
}


// Internal helper — NOT a route. Called from submitAssessment after XP/streak update.
export const checkAndUnlockAchievements = async (user) => {
  const achievements = await Achievement.find()
  const unlockedIds = new Set(user.unlockedAchievements.map((u) => u.achievement.toString()))
  const newlyUnlocked = []


  const attemptsCount = await Attempt.countDocuments({ user: user._id })
  const hasPerfectScore = await Attempt.exists({ user: user._id, score: 100 })
  const allAttempts = await Attempt.find({ user: user._id })
  const averageScore = allAttempts.length
    ? allAttempts.reduce((sum, a) => sum + a.score, 0) / allAttempts.length
    : 0


  for (const achievement of achievements) {
    if (unlockedIds.has(achievement._id.toString())) continue


    let qualifies = false
    switch (achievement.criteria.type) {
      case 'assessments_completed':
        qualifies = attemptsCount >= achievement.criteria.value
        break
      case 'perfect_score':
        qualifies = !!hasPerfectScore
        break
      case 'streak':
        qualifies = user.streak >= achievement.criteria.value
        break
      case 'high_average':
        qualifies = averageScore >= achievement.criteria.value
        break
    }


    if (qualifies) {
      user.unlockedAchievements.push({ achievement: achievement._id, unlockedAt: new Date() })
      newlyUnlocked.push({ title: achievement.title, description: achievement.description, icon: achievement.icon })
    }
  }


  return newlyUnlocked
}