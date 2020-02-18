import { msToMinutesSeconds } from '../lib/time'
import icon from '../../res/svg/soundcloud.svg'
import { getMostSimilar } from '../lib/string'
import { fetchUrl } from '../lib/fetch'

const infoUrl = url =>
  `https://jake.cafe/api/music/soundcloud/resolve?url=${encodeURIComponent(
    url
  )}`
const searchUrl = (query, type) =>
  `https://jake.cafe/api/music/soundcloud/search?q=${encodeURIComponent(
    query
  )}&type=${type}`

function testUrl(url) {
  const regex = /((http:\/\/(soundcloud\.com\/.*|soundcloud\.com\/.*\/.*|soundcloud\.com\/.*\/sets\/.*|soundcloud\.com\/groups\/.*|snd\.sc\/.*))|(https:\/\/(soundcloud\.com\/.*|soundcloud\.com\/.*\/.*|soundcloud\.com\/.*\/sets\/.*|soundcloud\.com\/groups\/.*)))/i
  return regex.test(url)
}

function parseObject(response) {
  const info = {}
  info.title = response.title
  info.format = 'digital file'
  info.attributes = ['streaming']
  info.date = response.created_at.split(' ')[0].replace(/\//g, '-')
  info.source = response.permalink_url

  if (response.kind === 'track') {
    info.type = 'single'
  } else {
    const length = response.tracks
      ? response.tracks.length
      : response.track_count
    if (length < 3) {
      info.type = 'single'
    } else if (length < 7) {
      info.type = 'ep'
    } else {
      info.type = 'album'
    }
  }

  if (response.tracks) {
    info.tracks = response.tracks.map(track => ({
      title: track.title,
      length: msToMinutesSeconds(track.duration),
    }))
  } else {
    info.tracks = [
      {
        title: response.title,
        length: msToMinutesSeconds(response.duration),
      },
    ]
  }

  return info
}

async function getInfo(url) {
  const response = await fetchUrl(infoUrl(url))
  if (!response) return null

  return parseObject(response)
}

function getBestMatch(title, artist, items) {
  const mainString = `${artist} ${title}`
  const thresholdSimilarity = 0.5
  return getMostSimilar(
    mainString,
    items,
    thresholdSimilarity,
    item => `${item.user.username} ${item.title}`
  )
}

async function search(title, artist, type) {
  const query = `${artist} ${title}`
  const results = await fetchUrl(searchUrl(query, type))
  if (!results || results.length === 0) {
    if (type !== 'single') return search(title, artist, 'single') // album may be posted as a single long track
  }

  const topResult = getBestMatch(title, artist, results)
  if (!topResult) return null

  return parseObject(topResult)
}

export default {
  test: testUrl,
  info: getInfo,
  search,
  icon,
}
