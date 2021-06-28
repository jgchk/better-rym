import { compareTwoStrings } from 'string-similarity'
import { Metadata } from '../../../find-stream-links/utils/page-data'
import { fetchJson } from '../../utils/fetch'
import { SearchFunction } from '../types'
import { MusicResult, SearchObject } from './codec'

const compareResults =
  ({ artist, title }: Metadata) =>
  (a: MusicResult, b: MusicResult) => {
    const aSimilarity = compareTwoStrings(
      `${artist} ${title}`,
      `${a.band_name} ${a.name}`
    )
    const bSimilarity = compareTwoStrings(
      `${artist} ${title}`,
      `${b.band_name} ${b.name}`
    )
    return bSimilarity - aSimilarity || a.score - b.score
  }

export const search: SearchFunction = async ({ artist, title }) => {
  const response = await fetchJson(
    {
      url: 'https://bandcamp.com/api/nusearch/2/autocomplete',
      urlParameters: { q: `${artist} ${title}` },
      headers: {
        'User-Agent':
          'android-async-http/1.4.1 (http://loopj.com/android-async-http)',
        Cookie: '$Version=1',
      },
    },
    SearchObject
  )

  return response.results
    .filter(MusicResult.is)
    .sort(compareResults({ artist, title }))[0]?.url
}
