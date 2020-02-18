export function msToMinutesSeconds(ms) {
  let minutes = Math.floor(ms / 60000)
  let seconds = Math.round((ms % 60000) / 1000)
  if (seconds === 60) {
    minutes += 1
    seconds = 0
  }
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

export function formatDate(dateString) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = (date.getDate() + 1).toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}
