export type TrackData = {
  id: number
  album_release_date: string | null
  artist: string
  current: {
    release_date: string | null
    publish_date: string
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
  id: number
  album_release_date: string | null
  artist: string
  current: {
    release_date: string | null
    publish_date: string
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

export type EmbedAlbumData = {
  tracks: EmbedTrackData[]
}

export type EmbedTrackData = {
  artist: string
  duration: number
  id: number
  title: string
  title_link: string
  track_streaming: boolean
  tracknum: number
}

export type SecondaryAlbumData = {
  '@type': 'MusicAlbum'
  albumRelease: AlbumRelease[]
}

export type SecondaryTrackData = {
  '@type': 'MusicRecording'
  inAlbum: InAlbum
}

export interface InAlbum {
  albumRelease: AlbumRelease[]
}

export interface AlbumRelease {
  recordLabel?: Label
}

export interface Label {
  name: string
}
