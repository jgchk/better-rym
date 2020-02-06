import { formatDate } from '../lib/time'
import { getMostSimilar } from '../lib/string'

const searchUrl = query => `https://api.jake.cafe/youtube/search?q=${encodeURIComponent(query)}`
const videoUrl = id => `https://www.youtube.com/watch?v=${id}`

async function search (title, artist, type) {
  const query = `${artist} ${title}`
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: searchUrl(query),
      responseType: 'json',
      onload: result => {
        if (result.status === 200) {
          const results = result.response.data.items
          if (!results || results.length === 0) {
            resolve(null)
          } else {
            const topResult = getBestMatch(title, artist, results)
            if (topResult) {
              resolve(parseObject(topResult))
            } else {
              resolve(null)
            }
          }
        } else {
          reject(result.status)
        }
      },
      onerror: error => reject(error)
    })
  })
}

function getBestMatch (title, artist, items) {
  const mainString = `${artist} ${title}`
  const thresholdSimilarity = 0.5
  return getMostSimilar(mainString, items, thresholdSimilarity, item => `${item.snippet.title}`)
}

function parseObject (object) {
  const info = {}
  info.title = object.snippet.title
  info.format = 'digital file'
  info.attributes = 'streaming'
  info.source = videoUrl(object.id.videoId)
  info.date = formatDate(object.snippet.publishedAt)
  return info
}

export default {
  search
}
