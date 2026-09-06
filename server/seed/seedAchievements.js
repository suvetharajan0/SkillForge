import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Achievement from '../models/Achievement.js'


dotenv.config()


const achievements = [
  { key: 'first_steps', title: 'First Steps', description: 'Complete your first assessment', icon: 'footprints', criteria: { type: 'assessments_completed', value: 1 } },
  { key: 'getting_serious', title: 'Getting Serious', description: 'Complete 5 assessments', icon: 'target', criteria: { type: 'assessments_completed', value: 5 } },
  { key: 'dedicated', title: 'Dedicated Learner', description: 'Complete 25 assessments', icon: 'graduation-cap', criteria: { type: 'assessments_completed', value: 25 } },
  { key: 'perfectionist', title: 'Perfectionist', description: 'Score 100% on an assessment', icon: 'star', criteria: { type: 'perfect_score', value: 100 } },
  { key: 'on_fire', title: 'On Fire', description: 'Maintain a 3-day streak', icon: 'flame', criteria: { type: 'streak', value: 3 } },
  { key: 'unstoppable', title: 'Unstoppable', description: 'Maintain a 7-day streak', icon: 'flame', criteria: { type: 'streak', value: 7 } },
  { key: 'high_achiever', title: 'High Achiever', description: 'Maintain a 90%+ average score', icon: 'trophy', criteria: { type: 'high_average', value: 90 } },
]


const run = async () => {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('MongoDB connected for seeding')


  for (const a of achievements) {
    await Achievement.findOneAndUpdate({ key: a.key }, a, { upsert: true, new: true })
  }


  console.log(`Seeded ${achievements.length} achievements`)
  await mongoose.disconnect()
  process.exit(0)
}


run().catch((err) => {
  console.error(err)
  process.exit(1)
})

