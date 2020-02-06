import { msToMinutesSeconds } from '../lib/time'
import icon from '../../res/svg/spotify.svg'
import { getMostSimilar } from '../lib/string'

const infoUrl = (type, id) => `https://api.jake.cafe/spotify/${type}/${id}`
const searchUrl = (query, type) => `https://api.jake.cafe/spotify/search?q=${encodeURIComponent(query)}&type=${type}`
const regex = /((http:\/\/(open\.spotify\.com\/.*|spoti\.fi\/.*|play\.spotify\.com\/.*))|(https:\/\/(open\.spotify\.com\/.*|play\.spotify\.com\/.*)))(album|track)\/([a-zA-Z0-9]+)/

function testUrl (url) {
  return regex.test(url)
}

function getInfo (url) {
  const match = url.match(regex)
  const type = match[6]
  const id = match[7]

  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: infoUrl(type, id),
      responseType: 'json',
      onload: result => {
        if (result.status === 200) {
          const info = parseResponse(result.response.body)
          resolve(info)
        } else {
          reject(result.status)
        }
      },
      onerror: error => reject(error)
    })
  })
}

function parseResponse (response) {
  const info = {}
  info.title = response.name
  info.format = 'digital file'
  info.attributes = ['streaming']
  info.date = response.release_date || response.album.release_date
  info.source = response.external_urls.spotify

  if (response.type === 'track') {
    info.type = 'single'
  } else if (response.album_type === 'single') {
    info.type = 'single'
  } else if (response.album_type === 'compilation') {
    info.type = 'compilation'
  } else {
    const length = response.total_tracks
    if (length < 3) {
      info.type = 'single'
    } else if (length < 7) {
      info.type = 'ep'
    } else {
      info.type = 'album'
    }
  }

  if (response.tracks) {
    info.tracks = response.tracks.items.map(track => ({
      title: track.name,
      length: msToMinutesSeconds(track.duration_ms)
    }))
  } else {
    info.tracks = [{
      title: response.name,
      length: msToMinutesSeconds(response.duration_ms)
    }]
  }

  return info
}

async function search (title, artist, type) {
  const query = `${artist} ${title}`
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: searchUrl(query, 'album'),
      responseType: 'json',
      onload: result => {
        if (result.status === 200) {
          const results = result.response.body.albums.items
          if (!results || results.length === 0) {
            resolve(null)
          } else {
            const topResult = getBestMatch(title, artist, results)
            if (topResult) {
              resolve(parseResponse(topResult))
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
  const key = item => {
    const tokens = []
    tokens.push(...item.artists.map(artist => artist.name))
    tokens.push(item.name)
    return tokens.join(' ')
  }
  return getMostSimilar(mainString, items, thresholdSimilarity, key)
}

export default {
  test: testUrl,
  info: getInfo,
  search,
  icon
}
