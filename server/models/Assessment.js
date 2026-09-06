import mongoose from 'mongoose'


const assessmentSchema = new mongoose.Schema(
  {title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: [true, 'An assessment must belong to a primary skill'],
    },
    questions: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Question',
      validate: {
        validator: function (arr) {
          return arr.length > 0
        },
        message: 'An assessment must contain at least one question',
      },
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'mixed'],
      default: 'mixed',
    },
   timeLimit: {
      type: Number, // minutes
      required: [true, 'Time limit is required'],
      min: [1, 'Time limit must be at least 1 minute'],
      max: [180, 'Time limit cannot exceed 180 minutes'],
    },
    passingScore: {
      type: Number, // percentage
      required: true,
      min: 0,
      max: 100,
      default: 70,
    },
  },
  { timestamps: true }
)


const Assessment = mongoose.model('Assessment', assessmentSchema)


export default Assessment