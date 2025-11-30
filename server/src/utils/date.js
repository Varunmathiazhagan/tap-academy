const MINUTES_IN_HOUR = 60
const MINUTES_IN_DAY = 24 * MINUTES_IN_HOUR
const MS_IN_MINUTE = 60 * 1000
const MS_IN_DAY = MINUTES_IN_DAY * MS_IN_MINUTE
const IST_OFFSET_MINUTES = 5 * MINUTES_IN_HOUR + 30 // UTC+05:30
const IST_OFFSET_MS = IST_OFFSET_MINUTES * MS_IN_MINUTE

function toISTTimestamp(date) {
  return new Date(date).getTime() + IST_OFFSET_MS
}

function fromISTTimestamp(timestamp) {
  return timestamp - IST_OFFSET_MS
}

function toISTDate(date) {
  return new Date(toISTTimestamp(date))
}

function fromISTDate(date) {
  return new Date(fromISTTimestamp(date.getTime()))
}

export function startOfDay(date) {
  const istTimestamp = toISTTimestamp(date)
  const istStart = Math.floor(istTimestamp / MS_IN_DAY) * MS_IN_DAY
  return new Date(fromISTTimestamp(istStart))
}

export function endOfDay(date) {
  const start = startOfDay(date)
  return new Date(start.getTime() + MS_IN_DAY - 1)
}

export function startOfMonth(date) {
  const istDate = toISTDate(date)
  istDate.setDate(1)
  istDate.setHours(0, 0, 0, 0)
  return fromISTDate(istDate)
}

export function endOfMonth(date) {
  const istDate = toISTDate(date)
  istDate.setMonth(istDate.getMonth() + 1)
  istDate.setDate(0)
  istDate.setHours(23, 59, 59, 999)
  return fromISTDate(istDate)
}

export function eachDayOfInterval(start, end) {
  const days = []
  let current = startOfDay(start)
  const last = startOfDay(end)

  while (current <= last) {
    days.push(new Date(current))
    current = new Date(current.getTime() + MS_IN_DAY)
  }

  return days
}

const DEFAULT_WORK_DAYS = [1, 2, 3, 4, 5]

export function isWorkingDay(date, workDays = DEFAULT_WORK_DAYS) {
  const istDay = toISTDate(date).getDay()
  return workDays.includes(istDay)
}

export function countWorkingDays(start, end, workDays = DEFAULT_WORK_DAYS) {
  return eachDayOfInterval(start, end).reduce((total, day) => {
    return total + (isWorkingDay(day, workDays) ? 1 : 0)
  }, 0)
}
