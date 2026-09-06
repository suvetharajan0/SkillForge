import mongoose from 'mongoose'


const questionSchema = new mongoose.Schema(
  {
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: [true, 'A question must belong to a skill'],
    },
   questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
      maxlength: [1000, 'Question text cannot exceed 1000 characters'],
    },

   options: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length >= 2 && arr.length <= 6
        },
        message: 'A question must have between 2 and 6 options',
      },
    },
    correctAnswerIndex: {
      type: Number,
      required: [true, 'You must specify which option is correct'],
      min: 0,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    explanation: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
)


const Question = mongoose.model('Question', questionSchema)


export default Question