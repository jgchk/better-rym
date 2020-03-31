import { fetchUrl } from '../lib/fetch'

export { test } from './sources'

const resolveUrl = url =>
  `https://jake.cafe/api/music/resolve?url=${encodeURIComponent(url)}`

export default function resolve(url) {
  return fetchUrl(resolveUrl(url))
}
