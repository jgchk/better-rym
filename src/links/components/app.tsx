import { pipe } from 'fp-ts/function'
import { FunctionComponent, h } from 'preact'
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks'
import { Complete } from '../../common/components/complete'
import { Failed } from '../../common/components/failed'
import { Loader } from '../../common/components/loader'
import { ServiceSelector } from '../../common/components/service-selector'
import { SERVICES, ServiceId, getMatchingService } from '../../common/services'
import {
  OneShot,
  complete,
  failed,
  fold,
  initial,
  isComplete,
  loading,
} from '../../common/utils/one-shot'
import { isDefined, isUndefined } from '../../common/utils/types'
import { useControlledInput } from '../hooks/use-controlled-input'
import styles from '../styles/app.module.css'

declare global {
  interface Window {
    submitMediaLink: () => void
  }
}

export const App: FunctionComponent<{ input: HTMLInputElement }> = ({
  input,
}) => {
  const [url, setUrl] = useControlledInput(input)

  const [serviceId, setServiceId] = useState<ServiceId | undefined>(undefined)
  const embedFunction = useMemo(
    () => (isDefined(serviceId) ? SERVICES[serviceId].embed : undefined),
    [serviceId]
  )

  useEffect(() => {
    const service = getMatchingService(url)
    if (isDefined(service)) {
      setServiceId(service.id)
    }
  }, [url])

  const [embedCode, setEmbedCode] = useState<
    OneShot<Error, string | undefined>
  >(initial)

  const fetchEmbedCode = useCallback(async () => {
    if (isUndefined(embedFunction)) {
      setEmbedCode(
        failed(new Error(`Cannot create embed codes for ${String(serviceId)}`))
      )
      return
    }

    setEmbedCode(loading)
    const nextEmbedCode = await embedFunction(url)
      .then((info) => complete(info))
      .catch((error) => failed(error))
    setEmbedCode(nextEmbedCode)
  }, [embedFunction, serviceId, url])

  useEffect(() => {
    if (isComplete(embedCode) && isDefined(embedCode.data)) {
      setUrl(embedCode.data)
    }
  }, [embedCode, setUrl])

  return (
    <div className={styles.container}>
      <ServiceSelector serviceId={serviceId} onSelect={setServiceId} />
      <input
        type='button'
        value='Convert to Embed'
        disabled={isUndefined(embedFunction)}
        onClick={fetchEmbedCode}
      />
      {pipe(
        embedCode,
        fold(
          () => null,
          () => <Loader />,
          (error) => <Failed error={error} />,
          () => <Complete />
        )
      )}
    </div>
  )
}
