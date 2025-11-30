import mongoose from 'mongoose'

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    checkInTime: {
      type: Date,
    },
    checkOutTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'half-day', 'holiday'],
      required: true,
      default: 'present',
    },
    totalHours: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
)

attendanceSchema.index({ user: 1, date: 1 }, { unique: true })

const Attendance = mongoose.model('Attendance', attendanceSchema)

export default Attendance
