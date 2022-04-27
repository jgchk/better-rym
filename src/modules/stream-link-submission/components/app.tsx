import { FunctionComponent, h } from 'preact'
import { useCallback, useEffect, useState } from 'preact/hooks'

import { Complete } from '../../../common/components/complete'
import { Failed } from '../../../common/components/failed'
import { Loader } from '../../../common/components/loader'
import { ServiceSelector } from '../../../common/components/service-selector'
import { EMBEDDABLES, getMatchingService } from '../../../common/services'
import { Embeddable, Service } from '../../../common/services/types'
import {
  complete,
  failed,
  fold,
  initial,
  isComplete,
  loading,
  OneShot,
} from '../../../common/utils/one-shot'
import { pipe } from '../../../common/utils/pipe'
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

  const [service, setService] = useState<(Service & Embeddable) | undefined>(
    undefined
  )

  useEffect(() => {
    const matchingService = getMatchingService(EMBEDDABLES)(url)
    if (matchingService) setService(matchingService)
  }, [url])

  const [embedCode, setEmbedCode] =
    useState<OneShot<Error, string | undefined>>(initial)

  const fetchEmbedCode = useCallback(async () => {
    if (!service) {
      setEmbedCode(
        failed(new Error(`Cannot create embed codes for ${String(service)}`))
      )
      return
    }

    setEmbedCode(loading)
    const nextEmbedCode = await service
      .embed(url)
      .then((info) => complete(info))
      .catch((error) => failed(error))
    setEmbedCode(nextEmbedCode)
  }, [service, url])

  useEffect(() => {
    if (isComplete(embedCode) && embedCode.data) setUrl(embedCode.data)
  }, [embedCode, setUrl])

  return (
    <div className={styles.container}>
      <ServiceSelector
        services={EMBEDDABLES}
        selected={service}
        onSelect={setService}
      />
      <input
        type='button'
        value='Convert to Embed'
        disabled={!service}
        onClick={() => void fetchEmbedCode()}
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
