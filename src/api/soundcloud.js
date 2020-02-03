import SC from 'soundcloud'
import { ms_to_minutes_seconds } from '../lib/time'

const client_id = '52dec9c30f7ac67e36faed73a9892095'
const redirect_uri = 'https://rateyourmusic.com/callback/soundcloud/'
SC.initialize({ client_id, redirect_uri })

function test_url (url) {
  const regex = /((http:\/\/(soundcloud\.com\/.*|soundcloud\.com\/.*\/.*|soundcloud\.com\/.*\/sets\/.*|soundcloud\.com\/groups\/.*|snd\.sc\/.*))|(https:\/\/(soundcloud\.com\/.*|soundcloud\.com\/.*\/.*|soundcloud\.com\/.*\/sets\/.*|soundcloud\.com\/groups\/.*)))/i
  return regex.test(url)
}

async function get_info (url) {
  const response = await SC.resolve(url)
  console.log(response)

  const info = {}
  info.title = response.title
  info.format = 'digital file'
  info.attributes = ['streaming']
  info.date = response.created_at.split(' ')[0].replace(/\//g, '-')
  info.source = response.permalink_url

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
      length: ms_to_minutes_seconds(track.duration)
    }))
  } else {
    info.tracks = [{
      title: response.title,
      length: ms_to_minutes_seconds(response.duration)
    }]
  }

  return info
}

export default {
  test: test_url,
  info: get_info
}
