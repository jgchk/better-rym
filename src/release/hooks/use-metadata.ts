import { createEffect, createState } from 'solid-js'
import { OneShot } from '../../common/utils/one-shot'
import { PageData, getPageData } from '../utils/page-data'

export type PageDataState = OneShot<PageData>

export const usePageData = (): PageDataState => {
  const [state, setState] = createState<PageDataState>({ type: 'initial' })

  const fetch = async () => {
    setState({ type: 'loading' })
    const pageData = await getPageData()
    setState({ type: 'complete', data: pageData })
  }

  createEffect(() => {
    if (state.type === 'initial') {
      void fetch()
    }
  })

  return state
}
