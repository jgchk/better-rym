import { fetchUrl } from '../lib/fetch'
import bandcampIcon from '../../res/svg/bandcamp.svg'
import discogsIcon from '../../res/svg/discogs.svg'
import soundcloudIcon from '../../res/svg/soundcloud.svg'
import spotifyIcon from '../../res/svg/spotify.svg'
import youtubeIcon from '../../res/svg/youtube.svg'

const resolveUrl = url =>
  `http://localhost:3000/api/music/resolve?url=${encodeURIComponent(url)}`

export const sources = {
  bandcamp: {
    regex: /((http:\/\/(.*\.bandcamp\.com\/|.*\.bandcamp\.com\/track\/.*|.*\.bandcamp\.com\/album\/.*))|(https:\/\/(.*\.bandcamp\.com\/|.*\.bandcamp\.com\/track\/.*|.*\.bandcamp\.com\/album\/.*)))/i,
    icon: bandcampIcon,
  },
  discogs: {
    regex: /((http|https):\/\/)?(.*\.)?(discogs\.com)?\/(.+)\/(release|master)\/(\d+)/i,
    icon: discogsIcon,
  },
  soundcloud: {
    regex: /((http:\/\/(soundcloud\.com\/.*|soundcloud\.com\/.*\/.*|soundcloud\.com\/.*\/sets\/.*|soundcloud\.com\/groups\/.*|snd\.sc\/.*))|(https:\/\/(soundcloud\.com\/.*|soundcloud\.com\/.*\/.*|soundcloud\.com\/.*\/sets\/.*|soundcloud\.com\/groups\/.*)))/i,
    icon: soundcloudIcon,
  },
  spotify: {
    regex: /(((http|https):\/\/)?(open\.spotify\.com\/.*|play\.spotify\.com\/.*))(album|track)\/([a-zA-Z0-9]+)/i,
    icon: spotifyIcon,
  },
  youtube: {
    regex: /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i,
    icon: youtubeIcon,
  },
}

export default function resolve(url) {
  return fetchUrl(resolveUrl(url))
}

export function test(url) {
  return Object.keys(sources).find(source => {
    const { regex } = sources[source]
    return regex.test(url)
  })
}
