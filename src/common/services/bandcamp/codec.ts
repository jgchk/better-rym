type UserResult = { type: 'f' }

type BandResult = { type: 'b' }

type AlbumResult = {
  type: 'a'
  url: string
  score: number
  band_name: string
  name: string
}

type TrackResult = {
  type: 't'
  url: string
  score: number
  band_name: string
  name: string
}

export type MusicResult = TrackResult | AlbumResult

export type SearchObject = {
  results: [BandResult | AlbumResult | TrackResult | UserResult]
}

export type TrackData = {
  album_release_date: string | null
  artist: string
  current: {
    release_date: string | null
    title: string
  }
  item_type: 'track'
  trackinfo: {
    duration: number
    title: string
  }[]
  url: string
}

export type AlbumData = {
  album_release_date: string | null
  artist: string
  current: {
    release_date: string | null
    title: string
  }
  item_type: 'album'
  trackinfo: {
    duration: number
    title: string
    track_num: number
  }[]
  url: string
}

export type ReleaseData = TrackData | AlbumData
