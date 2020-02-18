import { getMostSimilar } from '../lib/string'
import { fetchUrl } from '../lib/fetch'

const searchUrl = query =>
  `https://jake.cafe/api/music/youtube/search?q=${encodeURIComponent(query)}`

async function search (title, artist, type) {
  const query = `${artist} ${title}`
  const response = await fetchUrl(searchUrl(query))
  const results = response.items.filter(item => item.type === 'video')
  if (!results || results.length === 0) return null

  const topResult = getBestMatch(title, artist, results)
  if (!topResult) return null

  const info = parseObject(topResult)
  return info
}

function getBestMatch (title, artist, items) {
  const mainString = `${artist} ${title}`
  const thresholdSimilarity = 0.5
  return getMostSimilar(
    mainString,
    items,
    thresholdSimilarity,
    item => `${item.title}`
  )
}

function parseObject (object) {
  const info = {}
  info.title = object.title
  info.format = 'digital file'
  info.attributes = 'streaming'
  info.source = object.link
  return info
}

export default {
  search
}
