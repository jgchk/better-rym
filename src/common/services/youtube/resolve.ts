import { ResolveFunction } from '..'
import { secondsToString, stringToDate } from '../../utils/datetime'
import { fetchJson } from '../../utils/fetch'
import { isNull, isUndefined } from '../../utils/types'
import { YOUTUBE_KEY } from './auth'
import { Video } from './codecs'
import { regex } from './regex'

const parseDuration = (durationString: string) => {
  const seconds = /PT(?:(\d*)H)?(?:(\d*)M)?(?:(\d*)S)?/
    .exec(durationString)
    ?.slice(1)
    .map((v) => (!v ? 0 : Number.parseInt(v)))
    .reverse()
    .reduce((accumulator, v, k) => (accumulator += v * 60 ** k), 0)
  return seconds ? secondsToString(seconds) : undefined
}

export const resolve: ResolveFunction = async (url) => {
  const match = regex.exec(url)
  if (isNull(match)) throw new Error('Invalid Spotify URL')

  const id = match[1]
  if (isUndefined(id)) throw new Error('Could not find ID in link')

  const {
    items: [response],
  } = await fetchJson(
    {
      url: 'https://youtube.googleapis.com/youtube/v3/videos',
      urlParams: { id, part: 'snippet,contentDetails', key: YOUTUBE_KEY },
    },
    Video
  )

  const url_ = `https://www.youtube.com/watch?v=${response.id}`
  const title = response.snippet.title
  const date = stringToDate(response.snippet.publishedAt)
  const tracks = [
    { title, duration: parseDuration(response.contentDetails.duration) },
  ]

  return {
    url: url_,
    title,
    date,
    format: 'digital file',
    attributes: ['streaming'],
    tracks,
  }
}
