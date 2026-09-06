import nodemailer from 'nodemailer'


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})


const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"SkillForge" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  })
}


export default sendEmail