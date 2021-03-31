import { ReleaseDate } from '../services/types'

export const stringToDate = (dateString: string): ReleaseDate => {
  const date = new Date(dateString)
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  }
}

export const secondsToString = (seconds: number): string => {
  seconds = Math.round(seconds)
  const min = Math.floor(seconds / 60)
  const sec = Math.floor(seconds % 60)
  return `${min}:${sec.toString().padStart(2, '0')}`
}
