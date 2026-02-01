/**
 * RELEASE
 */
export type ReleaseData = {
  '@context': string
  '@type': 'MusicAlbum'
  name: string
  description: string
  citation: unknown[]
  tracks: TrackLockup[]
  workExample: Track[]
  url: string
  genre: string[]
  datePublished: string
  byArtist: ByArtist[]
}

export type ByArtist = {
  '@type': string
  url?: string
  name: string
}

export type Track = {
  '@type': 'MusicRecording'
  name: string
  url: string
  audio?: Audio
  offers?: Offers
  duration?: string
  image?: string
}

export type Audio = {
  '@type': AudioType
}

export enum AudioType {
  AudioObject = 'AudioObject',
}

export type Offers = {
  '@type': OffersType
  category: Category
  price: number
}

export enum OffersType {
  Offer = 'Offer',
}

export enum Category {
  Free = 'free',
}

// The TrackLockup (I don't know if "lockup" has some special meaning beyond
// being easily confused with "lookup"). Is part of the SSR hydration payload
// from `<script type="application/json" id="serialized-server-data">` and
// respresents a single track on the album page.
export type TrackLockup = {
  artistName: string
  artwork: string | null
  composer: string
  title: string
  trackNumber: number
  duration: number // in milliseconds
  discNumber: number
}

/**
 * VIDEO
 */
export type MusicVideoData = {
  '@context': string
  '@type': 'MusicVideoObject'
  name: string
  description: string
  url: string
  video: Video
  genre: string[]
  dateCreated: string
  duration: string
  image: string
  creator: Citation[]
  citation: Citation[]
  workExample: Citation[]
}

export enum Type {
  MusicGroup = 'MusicGroup',
  MusicVideoObject = 'MusicVideoObject',
}

export type Citation = {
  '@type': Type
  name: string
  url: string
  image?: string
}

export type Video = {
  '@type': string
  name: string
  description: string
  uploadDate: string
  thumbnailUrl: string
}

/**
 * SEARCH
 */
export type SearchObject = {
  results: [{ collectionViewUrl: string }]
}
