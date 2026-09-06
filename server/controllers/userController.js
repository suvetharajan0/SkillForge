import User from '../models/User.js'


// @desc  Get top users by XP
// @route GET /api/users/leaderboard
export const getLeaderboard = async (req, res, next) => {
  try {
    const users = await User.find().select('name xp level').sort({ xp: -1 }).limit(50)


    const leaderboard = users.map((u, index) => ({
      rank: index + 1,
      _id: u._id,
      name: u.name,
      xp: u.xp,
      level: u.level,
      isCurrentUser: u._id.toString() === req.user._id.toString(),
    }))


    res.json(leaderboard)
  } catch (err) {
    next(err)
  }
}