import { fetch } from '../../utils/fetch'
import type { SearchFunction } from '../types'
import { requestToken } from './auth'
import type { SearchObject } from './codecs'

export const search: SearchFunction = async ({ artist, title }) => {
  const token = await requestToken()
  if (!token) throw new Error('Could not find client id')

  const response = JSON.parse(
    await fetch({
      url: 'https://api-v2.soundcloud.com/search',
      urlParameters: { q: `${artist} ${title}`, client_id: token },
    }),
  ) as SearchObject

  return response.collection.find(
    (object) => object.kind === 'track' || object.kind === 'playlist',
  )?.permalink_url
}
