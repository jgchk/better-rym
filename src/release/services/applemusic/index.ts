import { SearchFunction } from '..'
import { fetchJson } from '../../../common/utils/fetch'
import { SearchObject } from './codec'

export const search: SearchFunction = async ({ artist, title }) => {
  const response = await fetchJson(
    {
      url: 'https://itunes.apple.com/search',
      urlParams: {
        term: `${artist} ${title}`,
        media: 'music',
        entity: 'album',
      },
    },
    SearchObject
  )
  return response.results[0]?.collectionViewUrl
}
