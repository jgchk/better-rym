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
