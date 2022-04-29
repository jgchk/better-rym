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
