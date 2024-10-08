import { h } from 'preact'
import { useCallback, useEffect, useState } from 'preact/hooks'

import { Complete } from '../../common/components/complete'
import { Failed } from '../../common/components/failed'
import { Loader } from '../../common/components/loader'
import { ServiceSelector } from '../../common/components/service-selector'
import { EMBEDDABLES, getMatchingService } from '../../common/services'
import type { Embeddable, Service } from '../../common/services/types'
import type { OneShot } from '../../common/utils/one-shot'
import {
  complete,
  failed,
  fold,
  initial,
  isComplete,
  loading,
} from '../../common/utils/one-shot'
import { pipe } from '../../common/utils/pipe'
import { useControlledInput } from './use-controlled-input'

export function StreamLinkConverter({ input }: { input: HTMLInputElement }) {
  const [url, setUrl] = useControlledInput(input)

  const [service, setService] = useState<(Service & Embeddable) | undefined>(
    undefined,
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
        failed(new Error(`Cannot create embed codes for ${String(service)}`)),
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
    <div
      style={{
        display: 'flex',
        gap: 4,
        alignItems: 'center',
        marginTop: 8,
      }}
    >
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
          () => <Complete />,
        ),
      )}
    </div>
  )
}
