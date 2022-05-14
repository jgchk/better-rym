export type SearchObject = {
  results: [{ collectionViewUrl: string }]
}

type ReleaseAttributes = {
  artistName: string
  artwork: {
    url: string
  }
  name: string
  recordLabel?: string
  releaseDate: string
  url: string
}

type ArtistRelationship = {
  attributes: {
    name: string
  }
}

type TrackRelationship = {
  attributes: {
    artistName: string
    durationInMillis: number
    name: string
    trackNumber: number
  }
}

export type MusicRelease = {
  type: 'albums'
  attributes: ReleaseAttributes
  relationships: {
    artists: {
      data: ArtistRelationship[]
    }
    tracks: {
      data: TrackRelationship[]
    }
  }
}

export type VideoRelease = {
  type: 'music-videos'
  attributes: ReleaseAttributes & { durationInMillis: number }
  relationships: {
    artists: {
      data: ArtistRelationship[]
    }
  }
}

export type Release = MusicRelease | VideoRelease

export const isVideoRelease = (r: Release): r is VideoRelease =>
  r.type === 'music-videos'

export type ReleaseHolder = {
  x: number
  d: Release[]
}
