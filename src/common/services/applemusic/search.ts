import { fetch } from '../../utils/fetch'
import { SearchFunction } from '../types'
import { SearchObject } from './codec'

export const search: SearchFunction = async ({ artist, title }) => {
  const response = JSON.parse(
    await fetch({
      url: 'https://itunes.apple.com/search',
      method: 'GET',
      urlParameters: {
        term: `${artist} ${title}`,
        media: 'music',
        entity: 'album',
      },
    })
  ) as SearchObject
  return response.results[0]?.collectionViewUrl
}
