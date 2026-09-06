import mongoose from 'mongoose'


const achievementSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'award' },
    criteria: {
      type: {
        type: String,
        required: true,
        enum: ['assessments_completed', 'perfect_score', 'streak', 'high_average'],
      },
      value: { type: Number, required: true },
    },
  },
  { timestamps: true }
)


const Achievement = mongoose.model('Achievement', achievementSchema)
export default Achievement