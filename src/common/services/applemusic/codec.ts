import * as t from 'io-ts'

export type AlbumResult = t.TypeOf<typeof AlbumResult>
export const AlbumResult = t.type(
  { collectionViewUrl: t.string },
  'AlbumResult'
)

export type SearchObject = t.TypeOf<typeof SearchObject>
export const SearchObject = t.type(
  { results: t.array(AlbumResult) },
  'SearchObject'
)

const Track = t.type(
  {
    attributes: t.type({
      artistName: t.string,
      name: t.string,
    }),
  },
  'Track'
)

const Release = t.type(
  {
    attributes: t.type({
      artistName: t.string,
      name: t.string,
      recordLabel: t.string,
    }),
    relationships: t.type({
      tracks: t.type({
        data: t.array(Track),
      }),
    }),
  },
  'Release'
)

export const ReleaseHolder = t.type(
  {
    x: t.Int,
    d: t.array(Release),
  },
  'ReleaseHolder'
)
