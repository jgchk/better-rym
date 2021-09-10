import { fetchJson } from '../../utils/fetch'
import { SearchFunction } from '../types'
import { requestToken } from './auth'
import { MusicObject, SearchObject } from './codecs'

export const search: SearchFunction = async ({ artist, title }) => {
  const token = await requestToken()
  if (!token) throw new Error('Could not find client id')

  const response = await fetchJson(
    {
      url: 'https://api-v2.soundcloud.com/search',
      urlParameters: { q: `${artist} ${title}`, client_id: token },
    },
    SearchObject
  )
  return response.collection.find(MusicObject.is)?.permalink_url
}
