import icon from '../../res/svg/bandcamp.svg'

const infoUrl = url => `https://api.jake.cafe/bandcamp/album?url=${encodeURIComponent(url)}`
const searchUrl = query => `https://api.jake.cafe/bandcamp/search?query=${encodeURIComponent(query)}`

function testUrl (url) {
  const regex = /((http:\/\/(.*\.bandcamp\.com\/|.*\.bandcamp\.com\/track\/.*|.*\.bandcamp\.com\/album\/.*))|(https:\/\/(.*\.bandcamp\.com\/|.*\.bandcamp\.com\/track\/.*|.*\.bandcamp\.com\/album\/.*)))/i
  return regex.test(url)
}

function getInfo (url) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: infoUrl(url),
      responseType: 'json',
      onload: result => {
        if (result.status === 200) {
          console.log('result', result)
          const info = parseAlbum(result.response)
          resolve(info)
        } else {
          reject(result.status)
        }
      },
      onerror: error => reject(error)
    })
  })
}

function parseAlbum (albumInfo) {
  const info = {}
  info.title = albumInfo.title
  info.format = 'lossless digital'
  info.attributes = ['downloadable', 'streaming']
  info.source = albumInfo.url

  const date = new Date(albumInfo.raw.album_release_date)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = (date.getDate() + 1).toString().padStart(2, '0')
  info.date = `${year}-${month}-${day}`

  const length = albumInfo.tracks.length
  if (length < 3) {
    info.type = 'single'
  } else if (length < 7) {
    info.type = 'ep'
  } else {
    info.type = 'album'
  }

  info.tracks = albumInfo.tracks.map(track => {
    const [min, sec] = track.duration.split(':')
    const length = `${parseInt(min)}:${sec}`

    return {
      title: track.name,
      length: length
    }
  })

  return info
}

function search (title, artist, type) {
  const query = `${title} ${artist}`
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: searchUrl(query),
      responseType: 'json',
      onload: async result => {
        if (result.status === 200) {
          const albumResults = result.response.filter(result => result.type === 'album')
          if (!albumResults || albumResults.length === 0) resolve(null)
          const topUrl = albumResults[0].url
          const topResult = await getInfo(topUrl)
          resolve(topResult)
        } else {
          reject(result.status)
        }
      },
      onerror: error => reject(error)
    })
  })
}

export default {
  test: testUrl,
  info: getInfo,
  search,
  icon
}
