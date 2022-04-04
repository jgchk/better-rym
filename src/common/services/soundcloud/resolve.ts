import { asArray, chunkArray } from '../../utils/array'
import { secondsToString, stringToDate } from '../../utils/datetime'
import { fetch } from '../../utils/fetch'
import { getReleaseType } from '../../utils/music'
import { ReleaseAttribute, ResolveFunction, Track } from '../types'
import { requestToken } from './auth'
import { MusicObject, TrackObject } from './codecs'

const formatTrack = ({ title, duration }: TrackObject) => ({
  title,
  duration: secondsToString(duration / 1000),
})

const getTracks = async (
  data: MusicObject,
  token: string
): Promise<Track[]> => {
  if (data.kind === 'track')
    return [
      { title: data.title, duration: secondsToString(data.duration / 1000) },
    ]

  const fullTracks = (
    await Promise.all(
      chunkArray(
        data.tracks.filter((track) => !track.title).map((track) => track.id),
        15
      ).map(
        async (ids) =>
          JSON.parse(
            await fetch({
              url: 'https://api-v2.soundcloud.com/tracks',
              urlParameters: { ids: ids.join(','), client_id: token },
            })
          ) as TrackObject[]
      )
    )
  ).flat()

  return (
    await Promise.all(
      data.tracks
        .map(
          (track) =>
            [
              track.id,
              track.title
                ? track
                : fullTracks.find(({ id }) => id === track.id),
            ] as const
        )
        .map(
          async ([id, track]) =>
            track ??
            (JSON.parse(
              await fetch({
                url: `https://api-v2.soundcloud.com/tracks/${id}`,
                urlParameters: { client_id: token },
              })
            ) as TrackObject)
        )
    )
  ).map(formatTrack)
}

const getCoverArt = (data: MusicObject) =>
  [
    data.artwork_url?.replace('-large', '-original'),
    data.artwork_url?.replace('-large', '-t500x500'),
    data.artwork_url,
    ...((data.kind === 'playlist'
      ? data.tracks
          .flatMap((track) =>
            track.artwork_url
              ? [
                  track.artwork_url?.replace('-large', '-original'),
                  track.artwork_url,
                ]
              : undefined
          )
          .filter((t) => t !== undefined)
      : []) as string[]),
  ].filter((a) => a != null) as string[]

export const resolve: ResolveFunction = async (url) => {
  const token = await requestToken()
  if (!token) throw new Error('Could not find client id')

  const response = JSON.parse(
    await fetch({
      url: 'https://api-v2.soundcloud.com/resolve',
      urlParameters: { url, client_id: token },
    })
  ) as MusicObject

  const url_ = response.permalink_url
  const title = response.title
  const artists = asArray(response.user.username)
  const date = stringToDate(response.display_date)
  const tracks = await getTracks(response, token)
  const type = getReleaseType(tracks.length)
  const coverArt = getCoverArt(response)

  const attributes: ReleaseAttribute[] = ['streaming']

  const downloadable = response.kind === 'track' && response.downloadable
  if (downloadable) {
    attributes.push('downloadable')
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
