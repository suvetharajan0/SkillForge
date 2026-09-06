import User from '../models/User.js'
import generateToken from '../utils/generateToken.js' 
import sendEmail from '../utils/sendEmail.js'
import bcrypt from 'bcryptjs'

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, techStack } = req.body


    if (!name || !email || !password) {
      res.status(400)
      throw new Error('Please provide name, email, and password')
    }


    const userExists = await User.findOne({ email })
    if (userExists) {
      res.status(400)
      throw new Error('A user with this email already exists')
    }


    const user = await User.create({ name, email, password, techStack })


    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      techStack: user.techStack,
      role:user.role,
      token:generateToken(user._id)
    })
  } catch (err) {
    next(err)
  }
}

export const loginUser = async(req,res,next)=>{
    try{
        const {email,password} = req.body
        if(!email || !password){
            res.status(400)
            throw new Error("Please provide email and password")
        }
        const user = await User.findOne({email: email.trim().toLowerCase()})
        if(!user){
          res.status(401)
          throw new Error("Invalid email or password")
        }
        const isMatch = await user.matchPassword(password)
        if(!isMatch){
            res.status(401)
            throw new Error("Invalid email or password")
        }
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            token:generateToken(user._id)
        })
    }
    catch(err){
        next(err)
    }
}

export const getMe = async(req,res)=>{
    res.json(req.user)
}

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body


    if (!email) {
      res.status(400)
      throw new Error('Please provide an email')
    }


    const user = await User.findOne({ email: email.trim().toLowerCase() })
    const genericResponse = { message: 'If an account exists for that email, a reset link has been sent.' }


    if (!user) {
      return res.json(genericResponse)
    }


    const resetToken = await user.getResetPasswordToken()
    await user.save()


    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${user._id}/${resetToken}`


    const html = `
      <p>You requested a password reset for your SkillForge account.</p>
      <p>Click the link below to set a new password. This link expires in 30 minutes.</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `


    try {
      await sendEmail({ to: user.email, subject: 'SkillForge Password Reset', html })
      res.json(genericResponse)
    } catch (emailErr) {
      user.resetPasswordToken = undefined
      user.resetPasswordExpire = undefined
      await user.save()
      res.status(500)
      throw new Error('Email could not be sent')
    }
  } catch (err) {
    next(err)
  }
}


export const resetPassword = async (req, res, next) => {
  try {
    const { userId, token } = req.params
    const { password } = req.body


    if (!password || password.length < 6) {
      res.status(400)
      throw new Error('Password must be at least 6 characters')
    }


    const user = await User.findOne({
      _id: userId,
      resetPasswordExpire: { $gt: Date.now() },
    })


    if (!user || !user.resetPasswordToken) {
      res.status(400)
      throw new Error('Invalid or expired reset link')
    }


    const isValidToken = await bcrypt.compare(token, user.resetPasswordToken)
    if (!isValidToken) {
      res.status(400)
      throw new Error('Invalid or expired reset link')
    }


    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()


    res.json({
      message: 'Password reset successful',
      token: generateToken(user._id),
    })
  } catch (err) {
    next(err)
  }
}
