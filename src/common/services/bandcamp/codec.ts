import * as t from 'io-ts'

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

export const TrackData = t.type(
  {
    album_release_date: t.union([t.string, t.null]),
    artist: t.string,
    current: t.type({
      release_date: t.union([t.string, t.null]),
      title: t.string,
    }),
    item_type: t.literal('track'),
    trackinfo: t.array(
      t.type({
        duration: t.number,
        title: t.string,
      })
    ),
    url: t.string,
  },
  'TrackData'
)

export const AlbumData = t.type(
  {
    album_release_date: t.union([t.string, t.null]),
    artist: t.string,
    current: t.type({
      release_date: t.union([t.string, t.null]),
      title: t.string,
    }),
    item_type: t.literal('album'),
    trackinfo: t.array(
      t.type({
        duration: t.number,
        title: t.string,
        track_num: t.Int,
      })
    ),
    url: t.string,
  },
  'AlbumData'
)

export type ReleaseData = t.TypeOf<typeof ReleaseData>
export const ReleaseData = t.union([TrackData, AlbumData])
