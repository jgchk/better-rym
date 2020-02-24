import { fetchUrl } from '../lib/fetch'
import sources from './index'

const resolveUrl = url =>
  `https://jake.cafe/api/music/resolve?url=${encodeURIComponent(url)}`

export default function resolve(url) {
  return fetchUrl(resolveUrl(url))
}

export function test(url) {
  return Object.keys(sources).find(source => {
    const { regex } = sources[source]
    return regex.test(url)
  })
}
