import { fetchUrl } from '../lib/fetch'
import icon from '../../res/svg/discogs.svg'

const infoUrl = (type, id) =>
  `https://jake.cafe/api/music/discogs/${type}/${id}`
const regex = /((http|https):\/\/)?(.*\.)?(discogs\.com)\/([a-zA-z-]+)\/(release|master)\/(\d+)/i

function testUrl (url) {
  return regex.test(url)
}

async function getInfo (url) {
  const match = url.match(regex)
  const type = match[6] + 's'
  const id = match[7]

  const response = await fetchUrl(infoUrl(type, id))
  if (!response) return null

  const info = parseResponse(response)
  return info
}

function parseResponse (response) {
  const info = {}
  info.title = response.title
  info.attributes = []
  info.date = response.released
  info.source = response.uri

  if (response.formats) {
    const format = response.formats[0].name.toLowerCase()
    if (format === 'file') {
      const losslessFormats = ['FLAC', 'ALAC']
      if (
        losslessFormats.some(format =>
          response.formats[0].descriptions.includes(format)
        )
      ) {
        info.format = 'lossless digital'
      } else {
        info.format = 'digital file'
      }
      info.attributes.push('downloadable')
    } else {
      info.format = format
    }
  }

  if (
    response.formats &&
    response.formats[0].descriptions.includes('Mixtape')
  ) {
    info.type = 'mixtape'
  } else if (response.tracklist) {
    const length = response.tracklist.length
    if (length < 3) {
      info.type = 'single'
    } else if (length < 7) {
      info.type = 'ep'
    } else {
      info.type = 'album'
    }
  }

  if (response.tracklist) {
    info.tracks = response.tracklist.map((track, i) => ({
      position:
        track.position ||
        parseInt(response.tracklist[i - 1].position) + 1 ||
        i + 1,
      title: track.title,
      length: track.duration
    }))
  }

  return info
}

export default {
  test: testUrl,
  info: getInfo,
  icon
}
