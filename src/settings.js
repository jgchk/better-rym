import { get, set } from './lib/settings'
import apiSources from './api/sources'

const defaultSources = Object.keys(apiSources)
export function sources(value) {
  const key = 'sources'
  if (value !== undefined) return set(key, value)
  return get('sources', defaultSources)
}

export function source(src, value) {
  const key = src
  if (value !== undefined) return set(key, value)
  return get(key, true)
}
