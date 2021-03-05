import { useCallback, useState } from 'preact/hooks'
import { ResolveData, ServiceId, resolve } from '../services'
import { OneShot, complete, failed, initial, loading } from '../utils/one-shot'

export type InfoState = OneShot<Error, ResolveData>
export type FetchFunction = (
  url: string,
  serviceId: ServiceId
) => Promise<InfoState>
export type UseReleaseInfoValue = {
  info: InfoState
  fetchInfo: FetchFunction
}

export const useReleaseInfo = (): UseReleaseInfoValue => {
  const [info, setInfo] = useState<InfoState>(initial)

  const fetchInfo: FetchFunction = useCallback(async (url, serviceId) => {
    setInfo(loading)
    const nextInfo = await resolve(url, serviceId)
      .then((info) => complete(info))
      .catch((error) => failed(error))
    setInfo(nextInfo)
    return nextInfo
  }, [])

  return { info, fetchInfo }
}
