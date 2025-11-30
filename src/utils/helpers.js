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

export function formatDate(date, options = {}) {
  return new Date(date).toLocaleDateString(undefined, options)
}

export function formatTime(date, options = { hour: '2-digit', minute: '2-digit' }) {
  return new Date(date).toLocaleTimeString([], options)
}

export function formatDateTime(date) {
  return `${formatDate(date)} ${formatTime(date)}`
}

export function calculateDuration(startTime, endTime) {
  if (!startTime || !endTime) return 0
  const duration = (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60)
  return Math.max(0, Number(duration.toFixed(2)))
}
