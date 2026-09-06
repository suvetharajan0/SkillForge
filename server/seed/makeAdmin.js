import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'


dotenv.config()


const email = process.argv[2]


if (!email) {
  console.error('Usage: node seed/makeAdmin.js <email>')
  process.exit(1)
}


const run = async () => {
  await mongoose.connect(process.env.MONGO_URI)


  const user = await User.findOne({ email: email.trim().toLowerCase() })
  if (!user) {
    console.error(`No user found with email: ${email}`)
    process.exit(1)
  }


  user.role = 'admin'
  await user.save()
  console.log(`✅ ${user.email} is now an admin.`)


  await mongoose.disconnect()
  process.exit(0)
}


run().catch((err) => {
  console.error(err)
  process.exit(1)
})
