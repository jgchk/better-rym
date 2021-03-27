import { VNode, h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { getMatchingService } from '../services'
import { Service } from '../services/types'
import styles from '../styles/form.module.css'
import { isDefined } from '../utils/types'
import { ServiceSelector } from './service-selector'

const CAPITALIZE_ID = 'brym-capitalize'

export type Properties<S extends Service> = {
  services: S[]
  submitText: string
  onSubmit: (url: string, service: S, autoCapitalize: boolean) => void
  showAutoCapitalize?: boolean
}

export const Form = <S extends Service>({
  services,
  submitText,
  onSubmit,
  showAutoCapitalize = false,
}: Properties<S>): VNode => {
  const [url, setUrl] = useState('')
  const [selectedService, setSelectedService] = useState<S | undefined>(
    undefined
  )
  const [showMissingServiceError, setShowMissingServiceError] = useState(false)
  const [autoCapitalize, setAutoCapitalize] = useState(true)

  useEffect(() => {
    const service = getMatchingService(services)(url)
    if (isDefined(service)) {
      setSelectedService(service)
    }
  }, [services, url])

  useEffect(() => {
    if (isDefined(selectedService)) {
      setShowMissingServiceError(false)
    }
  }, [selectedService])

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault()
        if (isDefined(selectedService)) {
          onSubmit(url, selectedService, autoCapitalize)
        } else {
          setShowMissingServiceError(true)
        }
      }}
    >
      <div className={styles.input}>
        <input
          type='url'
          value={url}
          required
          onInput={(event) => setUrl((event.target as HTMLInputElement).value)}
        />
        <ServiceSelector
          services={services}
          selected={selectedService}
          onSelect={setSelectedService}
        />
        {showMissingServiceError && (
          <div className={styles.error}>Select an import source</div>
        )}
        {showAutoCapitalize && (
          <label htmlFor={CAPITALIZE_ID}>
            <input
              id={CAPITALIZE_ID}
              type='checkbox'
              checked={autoCapitalize}
              onInput={(event) =>
                setAutoCapitalize((event.target as HTMLInputElement).checked)
              }
            />{' '}
            Auto-capitalize
          </label>
        )}
      </div>
      <input type='submit' value={submitText} className={styles.submit} />
    </form>
  )
}
