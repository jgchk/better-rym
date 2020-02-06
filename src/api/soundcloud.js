import { msToMinutesSeconds } from '../lib/time'
import icon from '../../res/svg/soundcloud.svg'
import { getMostSimilar } from '../lib/string'

const clientId = 'f0sxU3Az3dcl0lS1M9wFJ00SqawVL72n'
const redirectUri = 'https://rateyourmusic.com/callback/soundcloud/'
SC.initialize({
  client_id: clientId,
  redirect_uri: redirectUri
})

function testUrl (url) {
  const regex = /((http:\/\/(soundcloud\.com\/.*|soundcloud\.com\/.*\/.*|soundcloud\.com\/.*\/sets\/.*|soundcloud\.com\/groups\/.*|snd\.sc\/.*))|(https:\/\/(soundcloud\.com\/.*|soundcloud\.com\/.*\/.*|soundcloud\.com\/.*\/sets\/.*|soundcloud\.com\/groups\/.*)))/i
  return regex.test(url)
}

async function getInfo (url) {
  const response = await SC.resolve(url)
  return parseObject(response)
}

function parseObject (response) {
  const info = {}
  info.title = response.title
  info.format = 'digital file'
  info.attributes = ['streaming']
  info.date = response.created_at.split(' ')[0].replace(/\//g, '-')
  info.source = response.permalink_url

  if (response.kind === 'track') {
    info.type = 'single'
  } else {
    const length = response.tracks ? response.tracks.length : response.track_count
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

async function search (title, artist, type) {
  const query = `${artist} ${title}`
  const endpoint = type === 'single' ? '/tracks' : '/playlists'
  const response = await SC.get(endpoint, { q: query })
  if (!response || response.length === 0) {
    if (type === 'single') {
      return
    } else {
      return search(title, artist, 'single') // album may be posted as a single long track
    }
  }

  const topResult = getBestMatch(title, artist, response)
  if (topResult) return parseObject(topResult)
}

function getBestMatch (title, artist, items) {
  const mainString = `${artist} ${title}`
  const thresholdSimilarity = 0.5
  return getMostSimilar(mainString, items, thresholdSimilarity, item => `${item.user.username} ${item.title}`)
}

export default {
  test: testUrl,
  info: getInfo,
  search,
  icon
}
