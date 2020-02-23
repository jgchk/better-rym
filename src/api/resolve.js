import { fetchUrl } from '../lib/fetch'

const resolveUrl = url =>
  `https://jake.cafe/api/music/resolve?url=${encodeURIComponent(url)}`

export const sources = {
  bandcamp: {
    regex: /((http:\/\/(.*\.bandcamp\.com\/|.*\.bandcamp\.com\/track\/.*|.*\.bandcamp\.com\/album\/.*))|(https:\/\/(.*\.bandcamp\.com\/|.*\.bandcamp\.com\/track\/.*|.*\.bandcamp\.com\/album\/.*)))/i,
  },
  discogs: {
    regex: /((http|https):\/\/)?(.*\.)?(discogs\.com)?\/(.+)\/(release|master)\/(\d+)/i,
  },
  soundcloud: {
    regex: /((http:\/\/(soundcloud\.com\/.*|soundcloud\.com\/.*\/.*|soundcloud\.com\/.*\/sets\/.*|soundcloud\.com\/groups\/.*|snd\.sc\/.*))|(https:\/\/(soundcloud\.com\/.*|soundcloud\.com\/.*\/.*|soundcloud\.com\/.*\/sets\/.*|soundcloud\.com\/groups\/.*)))/i,
  },
  spotify: {
    regex: /(((http|https):\/\/)?(open\.spotify\.com\/.*|play\.spotify\.com\/.*))(album|track)\/([a-zA-Z0-9]+)/i,
  },
  youtube: {
    regex: /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i,
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
