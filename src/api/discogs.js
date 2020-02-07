import { fetchUrl } from '../lib/fetch'
import icon from '../../res/svg/discogs.svg'

const infoUrl = id => `https://api.jake.cafe/discogs/releases/${id}`
const regex = /((http:\/\/(.*\.discogs\.com\/[a-zA-z-]+\/release\/(\d+)))|(https:\/\/(.*\.discogs\.com\/[a-zA-z-]+\/release\/(\d+))))/i

function testUrl (url) {
  return regex.test(url)
}

async function getInfo (url) {
  const match = url.match(regex)
  const id = match[7]

  const response = await fetchUrl(infoUrl(id))
  if (!response) return null

  const info = parseResponse(response)
  return info
}

function parseResponse (response) {
  const info = {}
  info.title = response.title
  info.format = response.formats[0].name.toLowerCase()
  info.attributes = [] // TODO
  info.date = response.released
  info.source = response.uri

  const format = response.formats[0].name.toLowerCase()
  if (format === 'file') {
    const losslessFormats = ['FLAC', 'ALAC']
    if (losslessFormats.some(format => response.formats[0].descriptions.includes(format))) {
      info.format = 'lossless digital'
    } else {
      info.format = 'digital file'
    }
    info.attributes.push('downloadable')
  } else {
    info.format = format
  }

  const length = response.tracklist.length
  if (length < 3) {
    info.type = 'single'
  } else if (length < 7) {
    info.type = 'ep'
  } else {
    info.type = 'album'
  }

  info.tracks = response.tracklist.map(track => ({
    title: track.title,
    length: track.duration
  }))

  return info
}

export default {
  test: testUrl,
  info: getInfo,
  icon
}
