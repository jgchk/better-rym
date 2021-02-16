import { SearchFunction } from '..'
import { fetchJson } from '../../../common/utils/fetch'
import { AlbumSearchObject, TokenResponse } from './codecs'

const client_id = process.env.SPOTIFY_ID || ''
const client_secret = process.env.SPOTIFY_SECRET || ''

const requestToken = async () =>
  fetchJson(
    {
      method: 'POST',
      url: 'https://accounts.spotify.com/api/token',
      urlParams: { grant_type: 'client_credentials' },
      headers: {
        Authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
    TokenResponse
  )

export const search: SearchFunction = async ({ artist, title }) => {
  const token = await requestToken()
  const response = await fetchJson(
    {
      url: 'https://api.spotify.com/v1/search',
      urlParams: { q: `${artist} ${title}`, type: 'album' },
      headers: { Authorization: `Bearer ${token.access_token}` },
    },
    AlbumSearchObject
  )
  return response.albums.items[0]?.external_urls.spotify
}
