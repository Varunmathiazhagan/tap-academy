import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ['employee', 'manager'],
      required: true,
      default: 'employee',
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

userSchema.index({ role: 1 })
userSchema.index({ department: 1 })

const User = mongoose.model('User', userSchema)

export default User
