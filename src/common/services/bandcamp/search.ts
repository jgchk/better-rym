import { search as ddgSearch } from '../../utils/duckduckgo'
import { SearchFunction } from '../types'

export const search: SearchFunction = async ({ artist, title }) => {
  const ddg = await ddgSearch(`site:bandcamp.com/album ${artist} ${title}`)
  return ddg.results[0]?.url
}
