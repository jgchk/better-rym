import { useEffect, useState } from 'preact/hooks'
import {
  OneShot,
  complete,
  failed,
  initial,
  isInitial,
  loading,
} from '../../common/utils/one-shot'
import { PageData, getPageData } from '../utils/page-data'

export type PageDataState = OneShot<Error, PageData>

export const usePageData = (): PageDataState => {
  const [state, setState] = useState<PageDataState>(initial)

  const fetch = async () => {
    setState(loading)

    const nextState = await getPageData()
      .then((data) => complete(data))
      .catch((error) => failed(error))

    setState(nextState)
  }

  useEffect(() => {
    if (isInitial(state)) {
      void fetch()
    }
  }, [state])

  return state
}
