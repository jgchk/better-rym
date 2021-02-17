import { ReleaseDate } from '../services'

export const stringToDate = (dateString: string): ReleaseDate => {
  const date = new Date(dateString)
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate() + 1,
  }
}

export const secondsToString = (seconds: number): string => {
  const min = Math.floor(seconds / 60)
  const sec = Math.round(seconds % 60)
  return `${min}:${sec.toString().padStart(2, '0')}`
}
