import bcrypt from 'bcryptjs'
import { validationResult } from 'express-validator'
import User from '../models/User.js'
import { generateToken } from '../utils/token.js'
import { attendanceSettings } from '../config/attendanceSettings.js'

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

const { maxAge: _COOKIE_MAX_AGE, ...CLEAR_COOKIE_OPTIONS } = COOKIE_OPTIONS

function handleValidation(req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({
      message: errors.array().map((error) => error.msg).join(', '),
      errors: errors.array()
    })
    return false
  }
  return true
}

export async function register(req, res) {
  if (!handleValidation(req, res)) return
  let { name, email, password, employeeId, department } = req.body

  // Normalize inputs
  email = String(email).trim().toLowerCase()
  employeeId = String(employeeId).trim().toUpperCase()
  const normalizedDepartment = String(department).trim()
  const normalizedName = String(name).trim()
  const normalizedRole = 'employee'

  const existingUser = await User.findOne({ $or: [{ email }, { employeeId }] })
  if (existingUser) {
    return res.status(400).json({ message: 'User with this email or employee ID already exists' })
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
    settings: attendanceSettings,
  })
}

export async function login(req, res) {
  if (!handleValidation(req, res)) return
  let { email, password } = req.body
  email = String(email).trim().toLowerCase()

  const user = await User.findOne({ email })
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' })
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
    settings: attendanceSettings,
  })
}

export async function me(req, res) {
  const user = await User.findById(req.user.id).select('-password').lean()
  res.json({ user, settings: attendanceSettings })
}

export function logout(req, res) {
  res.clearCookie('token', CLEAR_COOKIE_OPTIONS)
  res.json({ message: 'Logged out' })
}
