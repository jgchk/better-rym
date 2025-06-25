import { asArray } from '../../utils/array'
import { secondsToString } from '../../utils/datetime'
import { fetch } from '../../utils/fetch'
import { getReleaseType } from '../../utils/music'
import type { ReleaseDate, ResolveData, ResolveFunction, Track } from '../types'
import { requestToken } from './auth'
import type {
  AlbumObject,
  AlbumTracks,
  AlbumType,
  ArtistObject,
  SimplifiedTrackObject,
  TrackObject,
} from './codecs'
import { isAlbumObject } from './codecs'
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
  numberOfDiscs: number,
): string =>
  numberOfDiscs === 1
    ? track.track_number.toString()
    : `${track.disc_number}.${track.track_number}`

const getTracks = async (
  tracks: AlbumTracks,
  artists: ArtistObject[],
  token: string,
): Promise<Track[]> => {
  let next = tracks.next
  const allTracks = tracks.items
  while (next !== null) {
    const nextResponse = JSON.parse(
      await fetch({
        url: next,
        headers: { Authorization: `Bearer ${token}` },
      }),
    ) as AlbumTracks
    allTracks.push(...nextResponse.items)
    next = nextResponse.next
  }

  // currently there's no proper way to add links to the individual artists, so it seems
  // counterproductive to add them to the song titles as it's more effort to fix all the
  // unlinked credits than to add them manually and it also messes with capitalization.
  const releaseArtists = new Set(artists.map((artist) => artist.name))
  const isLikelyVariousArtistsRelease = allTracks.some((track) => {
    const trackArtists = new Set(track.artists.map((artist) => artist.name))
    const trackContainsAllReleaseArtists =
      trackArtists.isSupersetOf(releaseArtists)
    return !trackContainsAllReleaseArtists
  })
  if (isLikelyVariousArtistsRelease) {
    alert(
      'This is likely to be a VA or split release. Please add the artist links to the tracks individually' +
        ' according to the guidelines as RYM artist lookup is not yet supported in this case.',
    )
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
  type === 'compilation' ? type : getReleaseType(numberOfTracks)

const getCoverArt = async (data: AlbumObject | TrackObject): Promise<string | undefined> => {
  const images = isAlbumObject(data) ? data.images : data.album.images
  const best = images.sort((a, b) => b.width * b.height - a.width * a.height)[0]
  if (!best?.url) return undefined

  const match = best.url.match(/([a-z0-9]{12})([a-z0-9]{4})([a-z0-9]{24})$/)
  if (match && match[2] !== '82c1') {
    const fullResUrl = best.url.replace(
      /([a-z0-9]{12})([a-z0-9]{4})([a-z0-9]{24})$/,
      `$182c1$3`
    )
    try {
      const body = await fetch({ url: fullResUrl })
      if (body && body.length > 0) return fullResUrl
    } catch (e) {
      // ignore
    }
  }
  return best.url
}

const resolveAlbum = async (
  id: string,
  token: string,
): Promise<ResolveData> => {
  const response = JSON.parse(
    await fetch({
      url: `https://api.spotify.com/v1/albums/${id}`,
      headers: { Authorization: `Bearer ${token}` },
    }),
  ) as AlbumObject

  console.log({ response })

  const url = response.external_urls.spotify
  const title = response.name
  const artists = response.artists.map((artist) => artist.name)
  const date = parseDate(response.release_date)
  const tracks = await getTracks(response.tracks, response.artists, token)
  const type = parseType(response.album_type, tracks.length)
  const coverArt = asArray(await getCoverArt(response))
  const label = {
    name: response.copyrights[0]?.text
      // https://github.com/jgchk/better-rym/issues/128
      .replaceAll('©', '')
      .trim()
      .replace(/^\d+/, '')
      .trim(),
  }

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
    label,
  }
}

const resolveTrack = async (
  id: string,
  token: string,
): Promise<ResolveData> => {
  const response = JSON.parse(
    await fetch({
      url: `https://api.spotify.com/v1/tracks/${id}`,
      headers: { Authorization: `Bearer ${token}` },
    }),
  ) as TrackObject

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
  const coverArt = asArray(await getCoverArt(response))

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
  if (match === null) throw new Error('Invalid Spotify URL')

  const type = match[1]
  if (!type || !isValidLinkType(type))
    throw new Error(
      `Expected link to be album/track. Received: ${String(type)}`,
    )

  const id = match[2]
  if (!id) throw new Error('Could not find ID in link')

  const { access_token } = await requestToken()
  return type === 'album'
    ? resolveAlbum(id, access_token)
    : resolveTrack(id, access_token)
}
