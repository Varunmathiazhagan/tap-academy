export function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export const IST_TIME_ZONE = 'Asia/Kolkata'
const DEFAULT_LOCALE = 'en-IN'
const DEFAULT_TIME_OPTIONS = { hour: '2-digit', minute: '2-digit' }

export function formatISTDate(date, options = {}, locale = DEFAULT_LOCALE) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString(locale, {
    ...options,
    timeZone: IST_TIME_ZONE,
  })
}

export function formatISTTime(date, options = {}, locale = DEFAULT_LOCALE) {
  if (!date) return '—'
  return new Date(date).toLocaleTimeString(locale, {
    ...DEFAULT_TIME_OPTIONS,
    ...options,
    timeZone: IST_TIME_ZONE,
  })
}

export function formatISTDateTime(date, dateOptions = {}, timeOptions = {}, locale = DEFAULT_LOCALE) {
  if (!date) return '—'
  const formattedDate = formatISTDate(date, dateOptions, locale)
  const formattedTime = formatISTTime(date, timeOptions, locale)
  return `${formattedDate} ${formattedTime}`.trim()
}

export function formatDate(date, options = {}, locale = DEFAULT_LOCALE) {
  return formatISTDate(date, options, locale)
}

export function formatTime(date, options = {}, locale = DEFAULT_LOCALE) {
  return formatISTTime(date, options, locale)
}

export function formatDateTime(date, dateOptions = {}, timeOptions = {}, locale = DEFAULT_LOCALE) {
  return formatISTDateTime(date, dateOptions, timeOptions, locale)
}

export function calculateDuration(startTime, endTime) {
  if (!startTime || !endTime) return 0
  const duration = (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60)
  return Math.max(0, Number(duration.toFixed(2)))
}
