import { compact, head, lookup, map as mapA } from 'fp-ts/Array'
import {
  chain as chainE,
  fromNullable as fromNullableE,
  fromOption,
  map as mapE,
} from 'fp-ts/Either'
import { flow, pipe } from 'fp-ts/function'
import {
  chain as chainO,
  fromNullable as fromNullableO,
  map as mapO,
} from 'fp-ts/Option'
import { map as mapT } from 'fp-ts/Task'
import { SearchFunction } from '..'
import fetch from '../../../common/utils/fetch'
import { decode } from '../../../common/utils/io-ts'
import { SearchObject } from './codecs'

export const search: SearchFunction = ({ artist, title }) =>
  pipe(
    fetch({
      url: 'https://youtube.com/results',
      urlParams: {
        search_query: `${artist} ${title}`,
      },
    }),
    mapT(
      flow(
        (response) => /var ytInitialData = (.*);<\/script>/.exec(response),
        fromNullableO,
        chainO(lookup(1)),
        fromOption(() => new Error('Could not find search metadata')),
        chainE(decode(SearchObject)),
        chainE(
          flow(
            (t) =>
              t.contents.twoColumnSearchResultsRenderer.primaryContents
                .sectionListRenderer.contents[0].itemSectionRenderer?.contents,
            fromNullableE(new Error('Could not find video data'))
          )
        ),
        mapE(
          flow(
            mapA(({ videoRenderer }) => fromNullableO(videoRenderer)),
            compact,
            head,
            mapO(({ videoId }) => `https://www.youtube.com/watch?v=${videoId}`)
          )
        )
      )
    )
  )
