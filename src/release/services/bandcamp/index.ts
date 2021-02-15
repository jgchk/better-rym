import { filter, head, sortBy } from 'fp-ts/Array'
import { map as mapE } from 'fp-ts/Either'
import { flow, pipe } from 'fp-ts/function'
import { map as mapO } from 'fp-ts/Option'
import { contramap, ordNumber } from 'fp-ts/Ord'
import { map as mapT } from 'fp-ts/Task'
import { compareTwoStrings } from 'string-similarity'
import { SearchFunction } from '..'
import fetch from '../../../common/utils/fetch'
import { decode } from '../../../common/utils/io-ts'
import { Metadata } from '../../utils/page-data'
import { MusicResult, SearchObject } from './codec'

const bySimilarity = ({ artist, title }: Metadata) =>
  pipe(
    ordNumber,
    contramap(
      (result: MusicResult) =>
        -1 *
        compareTwoStrings(
          `${artist} ${title}`,
          `${result.band_name} ${result.name}`
        )
    )
  )

const byScore = pipe(
  ordNumber,
  contramap((result: MusicResult) => result.score)
)

export const search: SearchFunction = ({ artist, title }) =>
  pipe(
    fetch({
      url: 'https://bandcamp.com/api/nusearch/2/autocomplete',
      urlParams: { q: `${artist} ${title}` },
      headers: {
        'User-Agent':
          'android-async-http/1.4.1 (http://loopj.com/android-async-http)',
        Cookie: '$Version=1',
      },
    }),
    mapT(
      flow(
        (response) => decode(SearchObject)(response),
        mapE(
          flow(
            ({ results }) => results,
            filter(MusicResult.is),
            sortBy([bySimilarity({ artist, title }), byScore]),
            head,
            mapO(({ url }) => url)
          )
        )
      )
    )
  )
