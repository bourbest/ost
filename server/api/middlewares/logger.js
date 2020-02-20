export function logger (req, res, next) {
  console.log(`${res.statusCode} ${req.method} ${req.originalUrl}`)
  next()
}