/**
 * RELEASE
 */
export interface ReleaseData {
  '@context': string
  '@type': 'MusicAlbum'
  name: string
  description: string
  citation: unknown[]
  tracks: Track[]
  workExample: Track[]
  url: string
  genre: string[]
  datePublished: string
  byArtist: ByArtist[]
}

export interface ByArtist {
  '@type': string
  url?: string
  name: string
}

export interface Track {
  '@type': 'MusicRecording'
  name: string
  url: string
  audio?: Audio
  offers?: Offers
  duration?: string
  image?: string
}

export interface Audio {
  '@type': AudioType
}

export enum AudioType {
  AudioObject = 'AudioObject',
}

export interface Offers {
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

/**
 * VIDEO
 */
export interface MusicVideoData {
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

export interface Citation {
  '@type': Type
  name: string
  url: string
  image?: string
}

export interface Video {
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
