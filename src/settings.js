import { get, set } from './lib/settings'
import apiSources from './api/sources'

const defaultSources = Object.keys(apiSources)
export function sources(value) {
  const key = 'sources'

  // if passed in a value, set the value
  if (value !== undefined) return set(key, value)

  // otherwise, get the value.
  const srcs = get('sources', defaultSources)
  // to account for new sources added in updates
  // we need to look for sources that are missing in settings,
  // but present in defaultSources (all available sources)
  defaultSources.forEach(src => {
    if (!srcs.includes(src)) srcs.push(src)
  })
  return srcs
}

export function source(src, value) {
  const key = src
  if (value !== undefined) return set(key, value)
  return get(key, true)
}
