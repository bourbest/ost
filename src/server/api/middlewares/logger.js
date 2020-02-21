export function logger (req, res, next) {
  if(process.env.NODE_ENV !== 'test') {
    console.log(`${res.statusCode} ${req.method} ${req.originalUrl}`)
  }
  next()
}