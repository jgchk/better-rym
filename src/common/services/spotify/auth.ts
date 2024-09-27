import { fetch } from '../../utils/fetch'
import { TokenResponse } from './codecs'

const client_id = import.meta.env.VITE_SPOTIFY_ID as string
const client_secret = import.meta.env.VITE_SPOTIFY_SECRET as string

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
    }),
  ) as TokenResponse
