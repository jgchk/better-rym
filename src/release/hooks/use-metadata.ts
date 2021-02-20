import { createEffect, createState } from 'solid-js'
import {
  OneShot,
  complete,
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
    const pageData = await getPageData()
    setState(complete(pageData))
  }

  createEffect(() => {
    if (isInitial(state)) {
      void fetch()
    }
  })

  return state
}
