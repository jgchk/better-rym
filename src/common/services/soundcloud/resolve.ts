import { array } from 'io-ts'
import { asArray, chunkArray } from '../../utils/array'
import { secondsToString, stringToDate } from '../../utils/datetime'
import { fetchJson } from '../../utils/fetch'
import { getReleaseType } from '../../utils/music'
import { isDefined, isNotNull, isUndefined } from '../../utils/types'
import { ResolveFunction, Track } from '../types'
import { requestToken } from './auth'
import { MusicObject, PlaylistObject, TrackObject } from './codecs'

const formatTrack = ({ title, duration }: TrackObject) => ({
  title,
  duration: secondsToString(duration / 1000),
})

const getTracks = async (
  data: MusicObject,
  token: string
): Promise<Track[]> => {
  if (TrackObject.is(data)) {
    return [
      { title: data.title, duration: secondsToString(data.duration / 1000) },
    ]
  } else {
    const fullTracks = (
      await Promise.all(
        chunkArray(
          data.tracks
            .filter((track) => !TrackObject.is(track))
            .map((track) => track.id),
          15
        ).map((ids) =>
          fetchJson(
            {
              url: 'https://api-v2.soundcloud.com/tracks',
              urlParameters: { ids: ids.join(','), client_id: token },
            },
            array(TrackObject)
          )
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
                TrackObject.is(track)
                  ? track
                  : fullTracks.find(({ id }) => id === track.id),
              ] as const
          )
          .map(([id, track]) =>
            isDefined(track)
              ? track
              : fetchJson(
                  {
                    url: `https://api-v2.soundcloud.com/tracks/${id}`,
                    urlParameters: { client_id: token },
                  },
                  TrackObject
                )
          )
      )
    ).map(formatTrack)
  }
}

const getCoverArt = (data: MusicObject) =>
  [
    data.artwork_url?.replace('-large', '-original'),
    data.artwork_url,
    ...(PlaylistObject.is(data)
      ? data.tracks
          .flatMap((track) =>
            TrackObject.is(track)
              ? [
                  track.artwork_url?.replace('-large', '-original'),
                  track.artwork_url,
                ]
              : undefined
          )
          .filter(isDefined)
      : []),
  ]
    .filter(isDefined)
    .filter(isNotNull)

export const resolve: ResolveFunction = async (url) => {
  const token = await requestToken()
  if (isUndefined(token)) throw new Error('Could not find client id')

  const response = await fetchJson(
    {
      url: 'https://api-v2.soundcloud.com/resolve',
      urlParameters: { url, client_id: token },
    },
    MusicObject
  )

  const url_ = response.permalink_url
  const title = response.title
  const artists = asArray(response.user.username)
  const date = stringToDate(response.display_date)
  const tracks = await getTracks(response, token)
  const type = getReleaseType(tracks.length)
  const coverArt = getCoverArt(response)

  return {
    url: url_,
    title,
    artists,
    date,
    type,
    format: 'digital file',
    attributes: ['streaming'],
    tracks,
    coverArt,
  }
}
