export function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function endOfDay(date) {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

export function startOfMonth(date) {
  const d = new Date(date)
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d
}

export function endOfMonth(date) {
  const d = new Date(date)
  d.setMonth(d.getMonth() + 1)
  d.setDate(0)
  d.setHours(23, 59, 59, 999)
  return d
}

export function eachDayOfInterval(start, end) {
  const days = []
  const current = startOfDay(start)
  const last = startOfDay(end)

  if (current > last) {
    return days
  }

  const cursor = new Date(current)
  while (cursor <= last) {
    days.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }

  return days
}

const DEFAULT_WORK_DAYS = [1, 2, 3, 4, 5]

export function isWorkingDay(date, workDays = DEFAULT_WORK_DAYS) {
  const day = new Date(date).getDay()
  return workDays.includes(day)
}

export function countWorkingDays(start, end, workDays = DEFAULT_WORK_DAYS) {
  return eachDayOfInterval(start, end).reduce((total, day) => {
    return total + (isWorkingDay(day, workDays) ? 1 : 0)
  }, 0)
}
