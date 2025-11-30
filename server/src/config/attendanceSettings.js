const officeStartHour = Number(process.env.OFFICE_START_HOUR || 9)
const officeEndHour = Number(process.env.OFFICE_END_HOUR || 18)
const lateThresholdMinutes = Number(process.env.LATE_THRESHOLD_MINUTES || 15)
const workDays = (process.env.WORK_DAYS || '1,2,3,4,5')
  .split(',')
  .map((value) => Number(value.trim()))
  .filter((value) => !Number.isNaN(value))

export const attendanceSettings = {
  officeStartHour,
  officeEndHour,
  lateThresholdMinutes,
  workDays: workDays.length ? workDays : [1, 2, 3, 4, 5],
}
