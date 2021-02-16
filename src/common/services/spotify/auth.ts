import { fetchJson } from '../../utils/fetch'
import { TokenResponse } from './codecs'

const client_id = process.env.SPOTIFY_ID || ''
const client_secret = process.env.SPOTIFY_SECRET || ''

export const requestToken = async (): Promise<TokenResponse> =>
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
