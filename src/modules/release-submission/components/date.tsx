import { FunctionComponent, h } from 'preact'
import { useCallback, useEffect, useState } from 'preact/hooks'

import { ReleaseDate, ResolveData } from '../../../common/services/types'
import { clsx } from '../../../common/utils/clsx'
import { datesEqual, dateToString } from '../../../common/utils/datetime'
import classes from '../styles/buttons.module.css'
import { fillDate } from '../utils/fillers'
import { FillData } from './dom.d'

export const DateButton: FunctionComponent = () => {
  const filledDate = useFilledDate()
  const [date, setDate] = useState<ReleaseDate>()
  const [publishDate, setPublishDate] = useState<ReleaseDate>()

  useEffect(() => {
    const listener = (e: CustomEvent<ResolveData>) => {
      const data = e.detail
      setDate(data.date)
      setPublishDate(data.publishDate)
    }

    document.addEventListener('importEvent', listener)
    return () => document.removeEventListener('importEvent', listener)
  }, [])

  return (
    <div style={{ marginTop: 4 }}>
      {date && (!filledDate || !datesEqual(date, filledDate)) && (
        <input
          type='button'
          className={clsx('btn', classes.smallButton)}
          value={`+ Release Date: ${dateToString(date)}`}
          onClick={() => fillDate(date)}
        />
      )}
      {publishDate && (!filledDate || !datesEqual(publishDate, filledDate)) && (
        <input
          type='button'
          className={clsx('btn', classes.smallButton)}
          value={`+ Publish Date: ${dateToString(publishDate)}`}
          onClick={() => fillDate(publishDate)}
        />
      )}
    </div>
  )
}

const useFilledDate = () => {
  const [filledDate, setFilledDate] = useState<ReleaseDate>()

  const readMonth = useCallback((el?: HTMLSelectElement) => {
    const monthEl =
      el ?? (document.getElementById('month') as HTMLSelectElement)
    if (!monthEl) return

    const val = Number.parseInt(monthEl.value)
    setFilledDate((d) => ({ ...d, month: val === 0 ? undefined : val }))
  }, [])

  const readDay = useCallback((el?: HTMLSelectElement) => {
    const dayEl = el ?? (document.getElementById('day') as HTMLSelectElement)
    if (!dayEl) return

    const val = Number.parseInt(dayEl.value)
    setFilledDate((d) => ({ ...d, day: val === 0 ? undefined : val }))
  }, [])

  const readYear = useCallback((el?: HTMLSelectElement) => {
    const yearEl = el ?? (document.getElementById('year') as HTMLSelectElement)
    if (!yearEl) return

    const val = Number.parseInt(yearEl.value)
    setFilledDate((d) => ({ ...d, year: val === 0 ? undefined : val }))
  }, [])

  // update filled date upon autofill
  useEffect(() => {
    const listener = (e: CustomEvent<FillData>) => {
      if (e.detail.filledField === 'date') {
        readMonth()
        readDay()
        readYear()
      }
    }

    document.addEventListener('fillEvent', listener)
    return () => document.removeEventListener('fillEvent', listener)
  }, [readDay, readMonth, readYear])

  // update filled date upon user edit
  useEffect(() => {
    const monthEl = document.getElementById('month') as HTMLSelectElement
    if (!monthEl) return

    const listener = (e: Event) => readMonth(e.target as HTMLSelectElement)

    monthEl.addEventListener('change', listener)
    return () => monthEl.removeEventListener('change', listener)
  }, [readMonth])

  useEffect(() => {
    const dayEl = document.getElementById('day') as HTMLSelectElement
    if (!dayEl) return

    const listener = (e: Event) => readDay(e.target as HTMLSelectElement)

    dayEl.addEventListener('change', listener)
    return () => dayEl.removeEventListener('change', listener)
  }, [readDay])

  useEffect(() => {
    const yearEl = document.getElementById('year') as HTMLSelectElement
    if (!yearEl) return

    const listener = (e: Event) => readYear(e.target as HTMLSelectElement)

    yearEl.addEventListener('change', listener)
    return () => yearEl.removeEventListener('change', listener)
  }, [readYear])

  return filledDate
}
