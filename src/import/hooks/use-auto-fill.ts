import { useCallback, useEffect, useState } from 'preact/hooks'
import { ResolveData, ServiceId, resolve } from '../../common/services'
import {
  OneShot,
  complete,
  failed,
  initial,
  isComplete,
  loading,
} from '../../common/utils/one-shot'
import { fill } from '../utils/fillers'

export type InfoState = OneShot<Error, ResolveData>
export type FillFunction = (url: string, serviceId: ServiceId) => Promise<void>

export const useAutoFill = (): { info: InfoState; autoFill: FillFunction } => {
  const [info, setInfo] = useState<InfoState>(initial)

  useEffect(() => {
    if (isComplete(info)) {
      fill(info.data)
    }
  }, [info])

  const autoFill: FillFunction = useCallback(async (url, serviceId) => {
    setInfo(loading)
    const nextInfo = await resolve(url, serviceId)
      .then((info) => complete(info))
      .catch((error) => failed(error))
    setInfo(nextInfo)
  }, [])

  return { info, autoFill }
}
