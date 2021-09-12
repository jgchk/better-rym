import { fetch } from '../../utils/fetch'
import { TokenResponse } from './codecs'

const client_id = process.env.SPOTIFY_ID || ''
const client_secret = process.env.SPOTIFY_SECRET || ''

export const requestToken = async (): Promise<TokenResponse> =>
  JSON.parse(
    await fetch({
      method: 'POST',
      url: 'https://accounts.spotify.com/api/token',
      urlParameters: { grant_type: 'client_credentials' },
      headers: {
        Authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  ) as TokenResponse
