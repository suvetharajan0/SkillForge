import Skill from '../models/Skill.js'
import Question from '../models/Question.js'
import Assessment from '../models/Assessment.js'

// @desc  Create a new skill
// @route POST /api/skills
export const createSkill = async (req, res, next) => {
  try {
    const { name, category, description } = req.body


    if (!name || !category) {
      res.status(400)
      throw new Error('Please provide name and category')
    }


    const skillExists = await Skill.findOne({ name })
    if (skillExists) {
      res.status(400)
      throw new Error('A skill with this name already exists')
    }


    const skill = await Skill.create({ name, category, description })
    res.status(201).json(skill)
  } catch (err) {
    next(err)
  }
}


// @desc  Get all skills
// @route GET /api/skills
export const getSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ category: 1, name: 1 })
    res.json(skills)
  } catch (err) {
    next(err)
  }
}


// @desc  Get a single skill by id
// @route GET /api/skills/:id
export const getSkillById = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id)


    if (!skill) {
      res.status(404)
      throw new Error('Skill not found')
    }


    res.json(skill)
  } catch (err) {
    next(err)
  }
}


// @desc  Update a skill
// @route PUT /api/skills/:id
export const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id)


    if (!skill) {
      res.status(404)
      throw new Error('Skill not found')
    }


    skill.name = req.body.name ?? skill.name
    skill.category = req.body.category ?? skill.category
    skill.description = req.body.description ?? skill.description


    const updatedSkill = await skill.save()
    res.json(updatedSkill)
  } catch (err) {
    next(err)
  }
}


// @desc  Delete a skill
// @route DELETE /api/skills/:id
export const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id)


    if (!skill) {
      res.status(404)
      throw new Error('Skill not found')
    }


    const questionCount = await Question.countDocuments({ skill: skill._id })
    const assessmentCount = await Assessment.countDocuments({ skill: skill._id })


    if (questionCount > 0 || assessmentCount > 0) {
      res.status(400)
      throw new Error(
        `Cannot delete "${skill.name}" — it's used by ${questionCount} question(s) and ${assessmentCount} assessment(s). Reassign or remove those first.`
      )
    }


    await skill.deleteOne()
    res.json({ message: 'Skill removed' })
  } catch (err) {
    next(err)
  }
}
