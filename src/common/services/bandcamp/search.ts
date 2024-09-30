import { fetch } from '../../utils/fetch'
import type { SearchFunction } from '../types'

export const search: SearchFunction = async ({ artist, title }) => {
  const response = await fetch({
    url: 'https://bandcamp.com/search',
    method: 'GET',
    urlParameters: {
      q: `${artist} ${title}`,
      item_type: 'a',
    },
  })

  const html = new DOMParser().parseFromString(response, 'text/html')
  const topResult = html.querySelector('.result-info')
  if (!topResult) {
    return undefined
  }

  const url = topResult.querySelector('.result-info .itemurl a')?.textContent
  return url ?? undefined
}
