import { ReleaseDate, ResolveData, ResolveFunction, Track } from '..'
import { secondsToString } from '../../utils/datetime'
import { fetchJson } from '../../utils/fetch'
import { getReleaseType } from '../../utils/music'
import { isNotNull, isNull, isUndefined } from '../../utils/types'
import { requestToken } from './auth'
import {
  AlbumObject,
  AlbumTracks,
  AlbumType,
  SimplifiedTrackObject,
  TrackObject,
} from './codecs'
import { regex } from './regex'

type LinkType = 'track' | 'album'
const isValidLinkType = (type: string): type is LinkType =>
  type === 'track' || type === 'album'

const parseDate = (date: string): ReleaseDate => {
  const [year, month, day] = date.split('-')
  return {
    year: year ? Number.parseInt(year) : undefined,
    month: month ? Number.parseInt(month) : undefined,
    day: day ? Number.parseInt(day) : undefined,
  }
}

const getPosition = (
  track: SimplifiedTrackObject,
  numberOfDiscs: number
): string =>
  numberOfDiscs === 1
    ? track.track_number.toString()
    : `${track.disc_number}.${track.track_number}`

const getTracks = async (
  tracks: AlbumTracks,
  token: string
): Promise<Track[]> => {
  let next = tracks.next
  const allTracks = tracks.items
  while (isNotNull(next)) {
    const nextResponse = await fetchJson(
      {
        url: next,
        headers: { Authorization: `Bearer ${token}` },
      },
      AlbumTracks
    )
    allTracks.push(...nextResponse.items)
    next = nextResponse.next
  }

  const numberOfDiscs = new Set(allTracks.map((track) => track.disc_number))
    .size
  return allTracks.map((track) => ({
    position: getPosition(track, numberOfDiscs),
    title: track.name,
    duration: secondsToString(track.duration_ms / 1000),
  }))
}

const parseType = (type: AlbumType, numberOfTracks: number) =>
  type === 'compilation' || type === 'single'
    ? type
    : getReleaseType(numberOfTracks)

const getCoverArt = (data: AlbumObject | TrackObject) => {
  const images = AlbumObject.is(data) ? data.images : data.album.images
  return images.sort((a, b) => b.width * b.height - a.width * a.height)[0]?.url
}

const resolveAlbum = async (
  id: string,
  token: string
): Promise<ResolveData> => {
  const response = await fetchJson(
    {
      url: `https://api.spotify.com/v1/albums/${id}`,
      headers: { Authorization: `Bearer ${token}` },
    },
    AlbumObject
  )

  const url = response.external_urls.spotify
  const title = response.name
  const artists = response.artists.map((artist) => artist.name)
  const date = parseDate(response.release_date)
  const tracks = await getTracks(response.tracks, token)
  const type = parseType(response.album_type, tracks.length)
  const coverArt = getCoverArt(response)

  return {
    url,
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

const resolveTrack = async (
  id: string,
  token: string
): Promise<ResolveData> => {
  const response = await fetchJson(
    {
      url: `https://api.spotify.com/v1/tracks/${id}`,
      headers: { Authorization: `Bearer ${token}` },
    },
    TrackObject
  )

  const url = response.external_urls.spotify
  const title = response.name
  const artists = response.artists.map((artist) => artist.name)
  const date = parseDate(response.album.release_date)
  const tracks = [
    {
      title: response.name,
      duration: secondsToString(response.duration_ms / 1000),
    },
  ]
  const coverArt = getCoverArt(response)

  return {
    url,
    title,
    artists,
    date,
    type: 'single',
    format: 'digital file',
    attributes: ['streaming'],
    tracks,
    coverArt,
  }
}

export const resolve: ResolveFunction = async (url) => {
  const match = regex.exec(url)
  if (isNull(match)) throw new Error('Invalid Spotify URL')

  const type = match[1]
  if (isUndefined(type) || !isValidLinkType(type))
    throw new Error(
      `Expected link to be album/track. Received: ${String(type)}`
    )

  const id = match[2]
  if (isUndefined(id)) throw new Error('Could not find ID in link')

  const { access_token } = await requestToken()
  return type === 'album'
    ? resolveAlbum(id, access_token)
    : resolveTrack(id, access_token)
}
