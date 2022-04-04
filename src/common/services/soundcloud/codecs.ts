type UserObject = { kind: 'user' }

export type TrackObject = {
  id: number
  kind: 'track'
  display_date: string
  downloadable: boolean
  duration: number
  permalink_url: string
  title?: string
  artwork_url: string | null
  user: {
    username: string
  }
}

export type PlaylistObject = {
  kind: 'playlist'
  permalink_url: string
  title: string
  display_date: string
  tracks: [TrackObject]
  artwork_url: string | null
  user: {
    username: string
  }
}

export type MusicObject = TrackObject | PlaylistObject

export type SearchObject = {
  collection: [TrackObject | UserObject | PlaylistObject]
}
