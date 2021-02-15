import { head } from 'fp-ts/Array'
import { map as mapE } from 'fp-ts/Either'
import { flow, pipe } from 'fp-ts/function'
import { map as mapO } from 'fp-ts/Option'
import { map as mapT } from 'fp-ts/Task'
import { chain as chainTE } from 'fp-ts/TaskEither'
import { SearchFunction } from '..'
import fetch from '../../../common/utils/fetch'
import { decode } from '../../../common/utils/io-ts'
import { AlbumSearchObject, TokenResponse } from './codecs'

const client_id = process.env.SPOTIFY_ID || ''
const client_secret = process.env.SPOTIFY_SECRET || ''

const requestToken = pipe(
  fetch({
    method: 'POST',
    url: 'https://accounts.spotify.com/api/token',
    urlParams: { grant_type: 'client_credentials' },
    headers: {
      Authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }),
  mapT(decode(TokenResponse))
)

export const search: SearchFunction = ({ artist, title }) =>
  pipe(
    requestToken,
    chainTE(({ access_token }) =>
      pipe(
        fetch({
          url: 'https://api.spotify.com/v1/search',
          urlParams: { q: `${artist} ${title}`, type: 'album' },
          headers: { Authorization: `Bearer ${access_token}` },
        }),
        mapT(
          flow(
            decode(AlbumSearchObject),
            mapE(
              flow(
                ({ albums: { items } }) => items,
                head,
                mapO(({ external_urls: { spotify } }) => spotify)
              )
            )
          )
        )
      )
    )
  )
