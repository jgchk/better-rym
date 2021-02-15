import { compact, filter, head, lookup, map as mapA } from 'fp-ts/Array'
import { fromOption, map as mapE } from 'fp-ts/Either'
import { flow, pipe } from 'fp-ts/function'
import { toArray } from 'fp-ts/lib/ReadonlyArray'
import {
  chain as chainO,
  fromNullable,
  map as mapO,
  sequenceArray as sequenceArrayO,
} from 'fp-ts/Option'
import { map as mapT, sequenceArray as sequenceArrayT } from 'fp-ts/Task'
import { chain as chainTE } from 'fp-ts/TaskEither'
import { SearchFunction } from '..'
import fetch from '../../../common/utils/fetch'
import { decode } from '../../../common/utils/io-ts'
import { MusicObject, SearchObject } from './codecs'

const getScriptUrls = pipe(
  fetch({ url: 'https://soundcloud.com' }),
  mapT(
    flow(
      (response) => [
        ...response.matchAll(
          /<script crossorigin src="(https:\/\/a-v2\.sndcdn\.com\/assets\/[\da-z-]+\.js)"><\/script>/gm
        ),
      ],
      mapA(lookup(1)),
      sequenceArrayO,
      mapO(toArray),
      fromOption(() => new Error('Could not find script URLs'))
    )
  )
)

const fetchClientId = (url: string) =>
  pipe(
    fetch({ url }),
    mapT(
      flow(
        (response) => /client_id:"([\dA-Za-z]+)"/.exec(response),
        fromNullable,
        chainO(lookup(1))
      )
    )
  )

const scrapeClientId = (urls: string[]) =>
  pipe(
    urls,
    mapA(flow(fetchClientId)),
    sequenceArrayT,
    mapT(
      flow(
        toArray,
        compact,
        head,
        fromOption(() => new Error('Could not find a client_id'))
      )
    )
  )

const requestToken = pipe(getScriptUrls, chainTE(scrapeClientId))

export const search: SearchFunction = ({ artist, title }) =>
  pipe(
    requestToken,
    chainTE((client_id) =>
      pipe(
        fetch({
          url: 'https://api-v2.soundcloud.com/search',
          urlParams: { q: `${artist} ${title}`, client_id },
        }),
        mapT(
          flow(
            decode(SearchObject),
            mapE(
              flow(
                ({ collection }) => collection,
                filter(MusicObject.is),
                head,
                mapO(({ permalink_url }) => permalink_url)
              )
            )
          )
        )
      )
    )
  )
