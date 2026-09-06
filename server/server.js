import 'dotenv/config'
import express from 'express' 
import cors from 'cors'
import mongoose from 'mongoose'

import connectDB from './config/db.js'
import testRoutes from './routes/testRoutes.js'
import authRoutes from './routes/authRoutes.js'
import skillRoutes from './routes/skillRoutes.js'
import questionRoutes from './routes/questionRoutes.js'
import assessmentRoutes from './routes/assessmentRoutes.js'
import attemptRoutes from './routes/attemptRoutes.js'
import achievementRoutes from './routes/achievementRoutes.js'
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import aiCoachRoutes from './routes/aiCoachRoutes.js'
import errorHandler from './middleware/errorHandler.js'

connectDB()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', testRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/skills', skillRoutes)
app.use('/api/questions', questionRoutes)
app.use('/api/assessments', assessmentRoutes)
app.use('/api/attempts', attemptRoutes)
app.use('/api/achievements', achievementRoutes)
app.use('/api/users', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/ai-coach', aiCoachRoutes)
app.use(errorHandler)


const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})