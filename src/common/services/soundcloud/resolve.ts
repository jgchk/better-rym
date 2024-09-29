import { asArray, chunkArray } from '../../utils/array'
import {
  ONE_MINUTE_MS,
  secondsToString,
  stringToDate,
} from '../../utils/datetime'
import { fetch } from '../../utils/fetch'
import { getReleaseType } from '../../utils/music'
import type { ReleaseAttribute, ResolveFunction, Track } from '../types'
import { requestToken } from './auth'
import type { MusicObject, TrackObject } from './codecs'

const formatTrack = ({
  title,
  duration,
  license,
}: TrackObject): Track & { cc: boolean } => ({
  title,
  duration: secondsToString(duration / 1000),
  cc: license.startsWith('cc-by'),
})

const getTracks = async (
  data: MusicObject,
  token: string,
): Promise<(Track & { cc: boolean })[]> => {
  if (data.kind === 'track') return [formatTrack(data)]

  const fullTrackResults = await Promise.all(
    chunkArray(
      data.tracks.filter((track) => !track.title).map((track) => track.id),
      15,
    ).map(
      async (ids) =>
        JSON.parse(
          await fetch({
            url: 'https://api-v2.soundcloud.com/tracks',
            urlParameters: { ids: ids.join(','), client_id: token },
          }),
        ) as TrackObject[],
    ),
  )
  const fullTracks = fullTrackResults.flat()

  const tracks = await Promise.all(
    data.tracks
      .map(
        (track) =>
          [
            track.id,
            track.title ? track : fullTracks.find(({ id }) => id === track.id),
          ] as const,
      )
      .map(
        async ([id, track]) =>
          track ??
          (JSON.parse(
            await fetch({
              url: `https://api-v2.soundcloud.com/tracks/${id}`,
              urlParameters: { client_id: token },
            }),
          ) as TrackObject),
      ),
  )

  return tracks.map(formatTrack)
}

const withExtension = (url: string, extension: string) => {
  const withoutExtension = url.slice(0, url.lastIndexOf('.'))
  return `${withoutExtension}.${extension}`
}

const getCoverArt = (data: MusicObject) => {
  const extensions = ['png', 'jpg', 'jpeg', 'gif']
  const withAllExtensions = (url: string) =>
    extensions.map((extension) => withExtension(url, extension))

  const urls: string[] = []

  if (data.artwork_url) {
    urls.push(
      data.artwork_url.replace('-large', '-original'),
      data.artwork_url.replace('-large', '-t500x500'),
      data.artwork_url,
    )
  }

  if (data.kind === 'playlist') {
    for (const track of data.tracks) {
      if (track.artwork_url) {
        urls.push(
          track.artwork_url.replace('-large', '-original'),
          track.artwork_url.replace('-large', '-t500x500'),
          track.artwork_url,
        )
      }
    }
  }

  return urls.flatMap((url) => withAllExtensions(url))
}

export const resolve: ResolveFunction = async (url) => {
  const token = await requestToken()
  if (!token) throw new Error('Could not find client id')

  const response = JSON.parse(
    await fetch({
      url: 'https://api-v2.soundcloud.com/resolve',
      urlParameters: { url, client_id: token },
    }),
  ) as MusicObject

  const url_ = response.permalink_url
  const title = response.title
  const artists = asArray(response.user.username)
  const date = stringToDate(response.display_date)
  const tracks = await getTracks(response, token)
  let type = getReleaseType(tracks.length)
  const coverArt = getCoverArt(response)

  const isLongTrack =
    response.kind === 'track' && response.duration >= 20 * ONE_MINUTE_MS
  if (isLongTrack) {
    type = 'dj mix'
  }

  const attributes: ReleaseAttribute[] = ['streaming']

  const downloadable = response.kind === 'track' && response.downloadable
  if (downloadable) {
    attributes.push('downloadable')
  }

  if (tracks.every((track) => track.cc)) {
    attributes.push('creative commons')
  }

  return {
    url: url_,
    title,
    artists,
    date,
    type,
    format: 'digital file',
    attributes,
    tracks,
    coverArt,
  }
}
