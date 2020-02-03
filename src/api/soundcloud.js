import SC from 'soundcloud'
import { msToMinutesSeconds } from '../lib/time'

const clientId = '52dec9c30f7ac67e36faed73a9892095'
const redirectUri = 'https://rateyourmusic.com/callback/soundcloud/'
SC.initialize({ clientId, redirectUri })

function testUrl (url) {
  const regex = /((http:\/\/(soundcloud\.com\/.*|soundcloud\.com\/.*\/.*|soundcloud\.com\/.*\/sets\/.*|soundcloud\.com\/groups\/.*|snd\.sc\/.*))|(https:\/\/(soundcloud\.com\/.*|soundcloud\.com\/.*\/.*|soundcloud\.com\/.*\/sets\/.*|soundcloud\.com\/groups\/.*)))/i
  return regex.test(url)
}

async function getInfo (url) {
  const response = await SC.resolve(url)
  console.log(response)

  const info = {}
  info.title = response.title
  info.format = 'digital file'
  info.attributes = ['streaming']
  info.date = response.createdAt.split(' ')[0].replace(/\//g, '-')
  info.source = response.permalinkUrl

  if (response.kind === 'track') {
    info.type = 'single'
  } else {
    const length = response.tracks.length
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
      length: msToMinutesSeconds(track.duration)
    }))
  } else {
    info.tracks = [{
      title: response.title,
      length: msToMinutesSeconds(response.duration)
    }]
  }

  return info
}

export default {
  test: testUrl,
  info: getInfo
}
