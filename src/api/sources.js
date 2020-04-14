const sources = {
  Spotify: {
    regex: /(((http|https):\/\/)?(open\.spotify\.com\/.*|play\.spotify\.com\/.*))(album|track)\/([a-zA-Z0-9]+)/i,
    icon: '../../res/svg/spotify.svg',
  },
  Bandcamp: {
    regex: /((http:\/\/(.*\.bandcamp\.com\/|.*\.bandcamp\.com\/track\/.*|.*\.bandcamp\.com\/album\/.*))|(https:\/\/(.*\.bandcamp\.com\/|.*\.bandcamp\.com\/track\/.*|.*\.bandcamp\.com\/album\/.*)))/i,
    icon: '../../res/svg/bandcamp.svg',
  },
  SoundCloud: {
    regex: /((http:\/\/(soundcloud\.com\/.*|soundcloud\.com\/.*\/.*|soundcloud\.com\/.*\/sets\/.*|soundcloud\.com\/groups\/.*|snd\.sc\/.*))|(https:\/\/(soundcloud\.com\/.*|soundcloud\.com\/.*\/.*|soundcloud\.com\/.*\/sets\/.*|soundcloud\.com\/groups\/.*)))/i,
    icon: '../../res/svg/soundcloud.svg',
  },
  YouTube: {
    regex: /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i,
    icon: '../../res/svg/youtube.svg',
  },
  Discogs: {
    regex: /((http|https):\/\/)?(.*\.)?(discogs\.com)?\/(.+)\/(release|master)\/(\d+)/i,
    icon: '../../res/svg/discogs.svg',
  },
  'Apple Music': {
    regex: /http(?:s)?:\/\/music\.apple\.com\/(\w{2,4})\/album\/([^/]*)\/([^?]+)[^/]*/,
    icon: '../../res/svg/applemusic.svg',
  },
  'Google Play': {
    regex: /http(?:s)?:\/\/play\.google\.com\/store\/music\/album\/(.+)\?id=(.+)/,
    icon: '../../res/svg/googleplay.svg',
  },
}

export default sources

export function test(url) {
  return Object.keys(sources).find(source => {
    const { regex } = sources[source]
    return regex.test(url)
  })
}
