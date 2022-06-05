import { ReleaseDate } from '../services/types'
import { isDefined } from './types'

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

export const datesEqual = (a: ReleaseDate, b: ReleaseDate) =>
  a.day === b.day && a.month === b.month && a.year === b.year

export const dateToString = (date: ReleaseDate) =>
  [
    date.year,
    date.month?.toString().padStart(2, '0'),
    date.day?.toString().padStart(2, '0'),
  ]
    .filter(isDefined)
    .join('-')

export const ONE_SECOND_MS = 1000
export const ONE_MINUTE_MS = 60 * ONE_SECOND_MS
