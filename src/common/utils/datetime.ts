import { ReleaseDate } from '../services'

export const stringToDate = (dateString: string): ReleaseDate => {
  const date = new Date(dateString)
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  }
}

export const secondsToString = (seconds: number): string => {
  const min = Math.floor(seconds / 60)
  const sec = Math.round(seconds % 60)
  return `${min}:${sec.toString().padStart(2, '0')}`
}
