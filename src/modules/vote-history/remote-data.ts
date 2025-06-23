/**
 * Remote data helpers for Vote History pages
 * -----------------------------------------
 * Provides fetch + cache utilities for:
 *   • music/film genres (two different CSV tabs)
 *   • descriptors
 * All lists live in a single public Google Sheets document.
 */

import * as storage from '~/common/utils/storage'

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

const fetchAndParseCsv = async <T extends { id: string; name: string }>(
  csvUrl: string,
  mapFn: (id: string, name: string) => T,
): Promise<T[]> => {
  try {
    const res = await fetch(csvUrl)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const text = await res.text()
    return text
      .split('\n')
      .map((line) => {
        const [id, name] = line.split(',')
        if (!id || !name) return null
        return mapFn(id.trim(), name.trim().replace(/^"|"$/g, ''))
      })
      .filter(Boolean) as T[]
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('BetterRYM: remote CSV fetch failed', e)
    return []
  }
}

// ---------------------------------------------------------------------------
// Genres
// ---------------------------------------------------------------------------

export type GenreItem = { id: string; name: string }

export const MUSIC_GENRES_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRNJstgpLKf1DdGqkLELfeBaO-iF7tL6juWIG7ILBkdfQNAlXICCyhkjLBfuNmu53j1MY-oATsOjX5f/pub?gid=0&single=true&output=csv'
export const FILM_GENRES_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRNJstgpLKf1DdGqkLELfeBaO-iF7tL6juWIG7ILBkdfQNAlXICCyhkjLBfuNmu53j1MY-oATsOjX5f/pub?gid=1422429819&single=true&output=csv'

export const MUSIC_CACHE_KEY = 'cached_music_genres'
export const FILM_CACHE_KEY = 'cached_film_genres'

export const getOrFetchGenres = async (
  storageKey: string,
  csvUrl: string,
): Promise<GenreItem[]> => {
  try {
    const cached = await storage.get<GenreItem[]>(storageKey)
    if (cached?.length) return cached
  } catch {}

  const fresh = await fetchAndParseCsv(csvUrl, (id, name) => ({ id, name }))
  if (fresh.length) await storage.set(storageKey, fresh)
  return fresh
}

export const forceFetchAndCacheGenres = async (
  storageKey: string,
  csvUrl: string,
): Promise<GenreItem[]> => {
  const fresh = await fetchAndParseCsv(csvUrl, (id, name) => ({ id, name }))
  await storage.set(storageKey, fresh)
  return fresh
}

// ---------------------------------------------------------------------------
// Descriptors
// ---------------------------------------------------------------------------

export type DescriptorItem = { id: string; name: string }

export const DESCRIPTORS_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRNJstgpLKf1DdGqkLELfeBaO-iF7tL6juWIG7ILBkdfQNAlXICCyhkjLBfuNmu53j1MY-oATsOjX5f/pub?gid=1356340080&single=true&output=csv'
export const DESCRIPTORS_CACHE_KEY = 'cached_descriptors'

export const getOrFetchDescriptors = async (): Promise<DescriptorItem[]> => {
  try {
    const cached = await storage.get<DescriptorItem[]>(DESCRIPTORS_CACHE_KEY)
    if (cached?.length) return cached
  } catch {}

  const fresh = await fetchAndParseCsv(DESCRIPTORS_CSV_URL, (id, name) => ({ id, name }))
  if (fresh.length) await storage.set(DESCRIPTORS_CACHE_KEY, fresh)
  return fresh
}

export const forceFetchAndCacheDescriptors = async (): Promise<DescriptorItem[]> => {
  const fresh = await fetchAndParseCsv(DESCRIPTORS_CSV_URL, (id, name) => ({ id, name }))
  await storage.set(DESCRIPTORS_CACHE_KEY, fresh)
  return fresh
} 