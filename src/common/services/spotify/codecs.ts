import * as t from 'io-ts'

export type TokenResponse = t.TypeOf<typeof TokenResponse>
export const TokenResponse = t.intersection(
  [
    t.type({
      access_token: t.string,
      expires_in: t.number,
      token_type: t.string,
    }),
    t.partial({
      scope: t.string,
    }),
  ],
  'TokenResponse'
)

const ExternalUrlObject = t.type({ spotify: t.string }, 'ExternalUrlObject')

const ImageObject = t.type(
  {
    width: t.Int,
    height: t.Int,
    url: t.string,
  },
  'ImageObject'
)

const SimplifiedAlbumObject = t.type(
  {
    external_urls: ExternalUrlObject,
    images: t.array(ImageObject),
    release_date: t.string,
  },
  'SimplifiedAlbumObject'
)

const PagingObject = <C extends t.Mixed>(item: C) =>
  t.type(
    {
      href: t.string,
      items: t.array(item),
      limit: t.Int,
      next: t.union([t.string, t.null]),
      offset: t.Int,
      previous: t.union([t.string, t.null]),
      total: t.Int,
    },
    'PagingObject'
  )

export type AlbumSearchObject = t.TypeOf<typeof AlbumSearchObject>
export const AlbumSearchObject = t.type(
  { albums: PagingObject(SimplifiedAlbumObject) },
  'AlbumSearchObject'
)

export type SimplifiedTrackObject = t.TypeOf<typeof SimplifiedTrackObject>
export const SimplifiedTrackObject = t.type(
  {
    disc_number: t.Int,
    duration_ms: t.Int,
    name: t.string,
    track_number: t.Int,
  },
  'SimplifiedTrackObject'
)

const ArtistObject = t.type({ name: t.string }, 'ArtistObject')

export type AlbumType = t.TypeOf<typeof AlbumType>
const AlbumType = t.union([
  t.literal('album'),
  t.literal('single'),
  t.literal('compilation'),
])

export type AlbumTracks = t.TypeOf<typeof AlbumTracks>
export const AlbumTracks = PagingObject(SimplifiedTrackObject)

export type AlbumObject = t.TypeOf<typeof AlbumObject>
export const AlbumObject = t.type(
  {
    album_type: AlbumType,
    artists: t.array(ArtistObject),
    external_urls: ExternalUrlObject,
    images: t.array(ImageObject),
    name: t.string,
    release_date: t.string,
    tracks: AlbumTracks,
  },
  'AlbumObject'
)

export type TrackObject = t.TypeOf<typeof TrackObject>
export const TrackObject = t.type(
  {
    album: SimplifiedAlbumObject,
    artists: t.array(ArtistObject),
    duration_ms: t.Int,
    external_urls: ExternalUrlObject,
    name: t.string,
  },
  'TrackObject'
)
