const errorHandler = (err, req, res, next) => {
  console.error(err.stack)


  // Mongoose validation errors (schema-level rules like match, minlength, maxlength)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({ message: messages[0] })
  }


  // Mongoose duplicate key error (e.g. unique email/skill name)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0]
    return res.status(400).json({ message: `That ${field} is already in use.` })
  }


  res.status(err.statusCode || 500).json({
    message: err.message || 'Server Error',
  })
}


export default errorHandler