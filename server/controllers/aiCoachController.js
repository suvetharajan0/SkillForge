import Attempt from '../models/Attempt.js'
import Skill from '../models/Skill.js'
import { geminiModel, MODEL_NAME } from '../config/gemini.js'


// @desc  Get AI-generated coaching insights based on the user's performance
// @route GET /api/ai-coach/insights
export const getInsights = async (req, res, next) => {
  try {
    const performance = await Attempt.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$skill',
          averageScore: { $avg: '$score' },
          attemptsCount: { $sum: 1 },
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
          averageScore: { $round: ['$averageScore', 0] }, 
          attemptsCount: 1,
        },
      },
    ])


    if (performance.length === 0) {
      return res.json({
        weakSkills: [],
        strongSkills: [],
        advice: "You haven't completed any assessments yet. Take a few assessments and check back here for personalized coaching!",
      })
    }


    const weakSkills = performance.filter((p) => p.averageScore < 70).sort((a, b) => a.averageScore - b.averageScore)
    const strongSkills = performance.filter((p) => p.averageScore >= 70).sort((a, b) => b.averageScore - a.averageScore)


    const summary = performance
      .map((p) => `${p.skillName}: ${p.averageScore}% average over ${p.attemptsCount} attempt(s)`)
      .join('\n')


    const prompt = `You are a friendly, encouraging coding skills coach. Here is a developer's assessment performance:\n\n${summary}\n\nWrite a short (3-5 sentence) coaching message: briefly acknowledge their strengths, then give specific, actionable advice on improving their weakest area(s). Be encouraging, not harsh. Plain text only, no markdown formatting.`


    const result = await geminiModel.models.generateContent({
      model:MODEL_NAME,
      contents:prompt,
    })
    const advice = result.text || 'Keep practicing to improve your skills!'


    res.json({ weakSkills, strongSkills, advice })
  } catch (err) {
    next(err)
  }
}


// @desc  Generate AI-written practice questions for a specific skill (not persisted)
// @route POST /api/ai-coach/practice-questions
export const generatePracticeQuestions = async (req, res, next) => {
  try {
    const { skillId } = req.body
    if (!skillId) {
      res.status(400)
      throw new Error('skillId is required')
    }


    const skill = await Skill.findById(skillId)
    if (!skill) {
      res.status(404)
      throw new Error('Skill not found')
    }


    const prompt = `Generate exactly 3 multiple-choice practice questions for the skill "${skill.name}" (category: ${skill.category}), at a medium difficulty suitable for a developer brushing up on this topic.


Respond with ONLY valid JSON — no markdown code fences, no explanation text, just the raw JSON array in this exact shape:
[
  {
    "questionText": "...",
    "options": ["...", "...", "...", "..."],
    "correctAnswerIndex": 0,
    "explanation": "..."
  }
]`


    const result = await geminiModel.models.generateContent({
      model:MODEL_NAME,
      contents:prompt,
    })
    const raw = result.text || '[]'
    const cleaned = raw.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '')


    let questions
    try {
      questions = JSON.parse(cleaned)
    } catch (parseErr) {
      res.status(500)
      throw new Error('AI response could not be parsed. Please try again.')
    }


    res.json({ skillName: skill.name, questions })
  } catch (err) {
    next(err)
  }
} 
