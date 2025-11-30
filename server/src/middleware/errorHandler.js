export function notFoundHandler(req, res, next) {
  res.status(404)
  next(new Error(`Not Found - ${req.originalUrl}`))
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode)
  const response = {
    message: err.message,
  }

  if (process.env.NODE_ENV !== 'production' && err.stack) {
    response.stack = err.stack
  }

  res.json(response)
}
