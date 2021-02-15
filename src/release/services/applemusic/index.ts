import { head } from 'fp-ts/Array'
import { map as mapE } from 'fp-ts/Either'
import { flow, pipe } from 'fp-ts/function'
import { map as mapO } from 'fp-ts/Option'
import { map as mapT } from 'fp-ts/Task'
import { SearchFunction } from '..'
import fetch from '../../../common/utils/fetch'
import { decode } from '../../../common/utils/io-ts'
import { SearchObject } from './codec'

export const search: SearchFunction = ({ artist, title }) =>
  pipe(
    fetch({
      url: 'https://itunes.apple.com/search',
      urlParams: {
        term: `${artist} ${title}`,
        media: 'music',
        entity: 'album',
      },
    }),
    mapT(
      flow(
        decode(SearchObject),
        mapE(
          flow(
            ({ results }) => results,
            head,
            mapO(({ collectionViewUrl }) => collectionViewUrl)
          )
        )
      )
    )
  )
