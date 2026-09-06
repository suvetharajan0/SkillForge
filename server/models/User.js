import mongoose from 'mongoose' 
import bcrypt from 'bcryptjs'
import crypto from 'crypto'


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
   email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    techStack: {
      type:String,
      default:'',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
     resetPasswordToken: String,
     resetPasswordExpire: Date,

    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    lastActivityDate: { type: Date, default: null },
    unlockedAchievements: [
      {
        achievement: { type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' },
        unlockedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
)



userSchema.pre('save', async function () {
  if (!this.isModified('password')) return 

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})


// Instance method to check a login password against the stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.getResetPasswordToken = async function () {
  const resetToken = crypto.randomUUID()


  this.resetPasswordToken = await bcrypt.hash(resetToken, 10)
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000 // 30 minutes


  return resetToken
}


const User = mongoose.model('User', userSchema)


export default User
