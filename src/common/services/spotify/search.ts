import { fetch } from '../../utils/fetch'
import type { SearchFunction } from '../types'
import { requestToken } from './auth'
import type { AlbumSearchObject } from './codecs'

export const search: SearchFunction = async ({ artist, title }) => {
  const token = await requestToken()
  const response = JSON.parse(
    await fetch({
      url: 'https://api.spotify.com/v1/search',
      urlParameters: { q: `${artist} ${title}`, type: 'album' },
      headers: { Authorization: `Bearer ${token.access_token}` },
    }),
  ) as AlbumSearchObject
  return response.albums.items[0]?.external_urls.spotify
}
