import { getMostSimilar } from '../lib/string'

const searchUrl = query => `https://api.jake.cafe/youtube/search?q=${encodeURIComponent(query)}`
const infoUrl = id => `https://api.jake.cafe/youtube/video/${id}`

function search (title, artist, type) {
  const query = `${artist} ${title}`
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: searchUrl(query),
      responseType: 'json',
      onload: async result => {
        if (result.status === 200) {
          const results = result.response.videos
          if (!results || results.length === 0) {
            resolve(null)
          } else {
            const topResult = getBestMatch(title, artist, results)
            if (topResult) {
              resolve(await getInfo(topResult.videoId))
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
  return getMostSimilar(mainString, items, thresholdSimilarity, item => `${item.title}`)
}

function getInfo (id) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: infoUrl(id),
      responseType: 'json',
      onload: result => {
        if (result.status === 200) {
          const info = parseObject(result.response)
          resolve(info)
        } else {
          reject(result.status)
        }
      },
      onerror: error => reject(error)
    })
  })
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
