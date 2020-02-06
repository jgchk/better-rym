import { getMostSimilar } from '../lib/string'
import { fetchUrl } from '../lib/fetch'

const searchUrl = query => `https://api.jake.cafe/youtube/search?q=${encodeURIComponent(query)}`
const infoUrl = id => `https://api.jake.cafe/youtube/video/${id}`

async function search (title, artist, type) {
  const query = `${artist} ${title}`
  const response = await fetchUrl(searchUrl(query))
  const results = response.videos
  if (!results || results.length === 0) return null

  const topResult = getBestMatch(title, artist, results)
  if (!topResult) return null

  const info = await getInfo(topResult.videoId)
  return info
}

function getBestMatch (title, artist, items) {
  const mainString = `${artist} ${title}`
  const thresholdSimilarity = 0.5
  return getMostSimilar(mainString, items, thresholdSimilarity, item => `${item.title}`)
}

async function getInfo (id) {
  const response = await fetchUrl(infoUrl(id))
  if (!response) return null

  const info = parseObject(response)
  return info
}

function parseObject (object) {
  const info = {}
  info.title = object.title
  info.format = 'digital file'
  info.attributes = 'streaming'
  info.source = object.url
  info.date = object.uploadDate
  return info
}

export default {
  search
}
