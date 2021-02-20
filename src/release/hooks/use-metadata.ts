import { createEffect, createState } from 'solid-js'
import {
  OneShot,
  complete,
  failed,
  initial,
  isInitial,
  loading,
} from '../../common/utils/one-shot'
import { PageData, getPageData } from '../utils/page-data'

export type PageDataState = OneShot<PageData>

export const usePageData = (): PageDataState => {
  const [state, setState] = createState<PageDataState>(initial())

  const fetch = async () => {
    setState(loading())

    const nextState = await getPageData()
      .then((data) => complete(data))
      .catch((error) => failed(error))

    setState(nextState)
  }

  createEffect(() => {
    if (isInitial(state)) {
      void fetch()
    }
  })

  return state
}
