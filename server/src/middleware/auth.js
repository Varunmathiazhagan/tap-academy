import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function authenticate(req, res, next) {
  try {
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).lean()

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    req.user = { ...user, id: user._id.toString() }
    return next()
  } catch (error) {
    console.error('Authentication error:', error)
    return res.status(401).json({ message: 'Invalid token' })
  }
}

export function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    return next()
  }
}
