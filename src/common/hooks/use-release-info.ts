import { useCallback, useState } from 'preact/hooks'
import { Resolvable, ResolveData, Service } from '../services/types'
import { OneShot, complete, failed, initial, loading } from '../utils/one-shot'

export type InfoState = OneShot<Error, ResolveData>
export type FetchFunction = (
  url: string,
  service: Service & Resolvable
) => Promise<InfoState>
export type UseReleaseInfoValue = {
  info: InfoState
  fetchInfo: FetchFunction
}

export const useReleaseInfo = (): UseReleaseInfoValue => {
  const [info, setInfo] = useState<InfoState>(initial)

  const fetchInfo: FetchFunction = useCallback(async (url, service) => {
    setInfo(loading)
    const nextInfo = await service
      .resolve(url)
      .then((info) => complete(info))
      .catch((error) => failed(error))
    setInfo(nextInfo)
    return nextInfo
  }, [])

  return { info, fetchInfo }
}
