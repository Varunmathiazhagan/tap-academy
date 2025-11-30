import User from '../models/User.js'

export async function getAllUsers(req, res) {
  const users = await User.find({ role: 'employee' })
    .select('name email employeeId department createdAt')
    .sort({ name: 1 })
    .lean()

  res.json({ users })
}

export async function getUserById(req, res) {
  const requestedId = req.params.id

  if (req.user.role !== 'manager' && req.user.id !== requestedId) {
    return res.status(403).json({ message: 'Forbidden' })
  }

  const user = await User.findById(requestedId)
    .select('name email employeeId department role createdAt')
    .lean()

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  res.json({ user })
}
