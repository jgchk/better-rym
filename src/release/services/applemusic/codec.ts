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
