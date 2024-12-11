export type TokenResponse = {
  access_token: string
  expires_in: number
  token_type: string
  scope?: string
}

type ExternalUrlObject = { spotify: string }

type ImageObject = {
  width: number
  height: number
  url: string
}

type SimplifiedAlbumObject = {
  external_urls: ExternalUrlObject
  images: ImageObject[]
  release_date: string
}

type CopyrightObject = { text: string }

type PagingObject<C> = {
  href: string
  items: C[]
  limit: number
  next: string | null
  offset: number
  previous: string | null
  total: number
}

export type AlbumSearchObject = { albums: PagingObject<SimplifiedAlbumObject> }

export type SimplifiedTrackObject = {
  disc_number: number
  duration_ms: number
  name: string
  track_number: number
  artists: ArtistObject[]
}

export type ArtistObject = {
  external_urls: ExternalUrlObject
  href: string
  id: string
  name: string
  type: string
  uri: string
}

export type AlbumType = 'album' | 'single' | 'compilation'

export type AlbumTracks = PagingObject<SimplifiedTrackObject>

export type AlbumObject = {
  album_type: AlbumType
  artists: ArtistObject[]
  copyrights: CopyrightObject[]
  external_urls: ExternalUrlObject
  images: ImageObject[]
  name: string
  release_date: string
  tracks: AlbumTracks
}

export type TrackObject = {
  album: SimplifiedAlbumObject
  artists: ArtistObject[]
  duration_ms: number
  external_urls: ExternalUrlObject
  name: string
}

export const isAlbumObject = (o: AlbumObject | TrackObject): o is AlbumObject =>
  'album_type' in o
