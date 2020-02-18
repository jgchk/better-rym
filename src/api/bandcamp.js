import icon from '../../res/svg/bandcamp.svg'
import { getMostSimilar } from '../lib/string'
import { formatDate, msToMinutesSeconds } from '../lib/time'
import { fetchUrl } from '../lib/fetch'

const infoUrl = url =>
  `https://jake.cafe/api/music/bandcamp/album?url=${encodeURIComponent(url)}`
const searchUrl = query =>
  `https://jake.cafe/api/music/bandcamp/search?query=${encodeURIComponent(
    query
  )}`

function testUrl(url) {
  const regex = /((http:\/\/(.*\.bandcamp\.com\/|.*\.bandcamp\.com\/track\/.*|.*\.bandcamp\.com\/album\/.*))|(https:\/\/(.*\.bandcamp\.com\/|.*\.bandcamp\.com\/track\/.*|.*\.bandcamp\.com\/album\/.*)))/i
  return regex.test(url)
}

function parseAlbum(albumInfo) {
  const info = {}
  info.title = albumInfo.title
  info.format = 'lossless digital'
  info.attributes = ['downloadable', 'streaming']
  info.source = albumInfo.url
  info.date = formatDate(
    albumInfo.raw.album_release_date || albumInfo.raw.current.release_date
  )

  const { length } = albumInfo.raw.trackinfo
  if (length < 3) {
    info.type = 'single'
  } else if (length < 7) {
    info.type = 'ep'
  } else {
    info.type = 'album'
  }

  info.tracks = albumInfo.raw.trackinfo.map((track, i) => ({
    position:
      track.track_num ||
      parseInt(albumInfo.raw.trackinfo[i - 1].track_num, 10) + 1 ||
      i + 1,
    title: track.title,
    length: msToMinutesSeconds(track.duration * 1000),
  }))

  return info
}

async function getInfo(url) {
  const response = await fetchUrl(infoUrl(url))
  if (!response) return null

  const info = parseAlbum(response)
  return info
}

function getBestMatch(title, artist, items) {
  const mainString = `${artist} ${title}`
  const thresholdSimilarity = 0.5
  return getMostSimilar(
    mainString,
    items,
    thresholdSimilarity,
    item => `${item.artist} ${item.name}`
  )
}

async function search(title, artist) {
  const query = `${title} ${artist}`
  const results = await fetchUrl(searchUrl(query))
  const albumResults = results.filter(result => result.type === 'album')
  if (!albumResults || albumResults.length === 0) return null

  const topResult = getBestMatch(title, artist, albumResults)
  if (!topResult) return null

  const info = await getInfo(topResult.url)
  return info
}

export default {
  test: testUrl,
  info: getInfo,
  search,
  icon,
}
