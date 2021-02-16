import * as t from 'io-ts'

export type TokenResponse = t.TypeOf<typeof TokenResponse>
export const TokenResponse = t.type(
  {
    access_token: t.string,
    expires_in: t.number,
    scope: t.string,
    token_type: t.string,
  },
  'TokenResponse'
)

const ExternalUrlObject = t.type({ spotify: t.string }, 'ExternalUrlObject')

const SimplifiedAlbumObject = t.type(
  { external_urls: ExternalUrlObject },
  'SimplifiedAlbumObject'
)

export type AlbumSearchObject = t.TypeOf<typeof AlbumSearchObject>
export const AlbumSearchObject = t.type({
  albums: t.type(
    {
      href: t.string,
      items: t.array(SimplifiedAlbumObject),
      limit: t.Int,
      next: t.union([t.string, t.null]),
      offset: t.Int,
      previous: t.union([t.string, t.null]),
      total: t.Int,
    },
    'PagingObject'
  ),
})
