import * as t from 'io-ts'

const UserResult = t.type({ type: t.literal('f') }, 'UserResult')

const BandResult = t.type({ type: t.literal('b') }, 'BandResult')

const AlbumResult = t.type(
  {
    type: t.literal('a'),
    url: t.string,
    score: t.Int,
    band_name: t.string,
    name: t.string,
  },
  'AlbumResult'
)

const TrackResult = t.type(
  {
    type: t.literal('t'),
    url: t.string,
    score: t.Int,
    band_name: t.string,
    name: t.string,
  },
  'TrackResult'
)

export type MusicResult = t.TypeOf<typeof MusicResult>
export const MusicResult = t.union([TrackResult, AlbumResult])

export const SearchObject = t.type(
  {
    results: t.array(
      t.union([BandResult, AlbumResult, TrackResult, UserResult])
    ),
  },
  'SearchObject'
)

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
