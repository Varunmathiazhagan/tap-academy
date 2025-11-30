import bcrypt from 'bcryptjs'
import { validationResult } from 'express-validator'
import User from '../models/User.js'
import { generateToken } from '../utils/token.js'

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

function handleValidation(req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400)
    throw new Error(errors.array().map((error) => error.msg).join(', '))
  }
}

export async function register(req, res) {
  handleValidation(req, res)
  let { name, email, password, employeeId, department } = req.body

  // Normalize inputs
  email = String(email).trim().toLowerCase()
  employeeId = String(employeeId).trim().toUpperCase()
  const normalizedDepartment = String(department).trim()
  const normalizedName = String(name).trim()
  const normalizedRole = 'employee'

  const existingUser = await User.findOne({ $or: [{ email }, { employeeId }] })
  if (existingUser) {
    res.status(400)
    throw new Error('User with this email or employee ID already exists')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    name: normalizedName,
    email,
    password: hashedPassword,
    role: normalizedRole,
    employeeId,
    department: normalizedDepartment,
  })

  const token = generateToken(user._id)
  res.cookie('token', token, COOKIE_OPTIONS)

  res.status(201).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
      department: user.department,
    },
    token,
  })
}

export async function login(req, res) {
  handleValidation(req, res)
  let { email, password } = req.body
  email = String(email).trim().toLowerCase()

  const user = await User.findOne({ email })
  if (!user) {
    res.status(401)
    throw new Error('Invalid credentials')
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    res.status(401)
    throw new Error('Invalid credentials')
  }

  const token = generateToken(user._id)
  res.cookie('token', token, COOKIE_OPTIONS)

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
      department: user.department,
    },
    token,
  })
}

export async function me(req, res) {
  const user = await User.findById(req.user.id).select('-password').lean()
  res.json({ user })
}

export function logout(req, res) {
  res.clearCookie('token', COOKIE_OPTIONS)
  res.json({ message: 'Logged out' })
}
