import { h, VNode } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import {
  CAPITALIZATION_TYPES,
  CapitalizationType,
} from '../../release-submission/utils/capitalization'
import { getMatchingService } from '../services'
import { Service } from '../services/types'
import styles from '../styles/form.module.css'
import { ServiceSelector } from './service-selector'

const CAPITALIZE_ID = 'brym-capitalize'

const CAPITALIZATION_TYPE_MAP: Record<CapitalizationType, string> = {
  'title-case': 'Title Case',
  'sentence-case': 'Sentence case',
  'as-is': 'Keep as-is',
}

export type Properties<S extends Service> = {
  services: S[]
  submitText: string
  onSubmit: (
    url: string,
    service: S,
    capitalization: CapitalizationType
  ) => void
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
  const [capitalization, setCapitalization] =
    useState<CapitalizationType>('title-case')

  useEffect(() => {
    const service = getMatchingService(services)(url)
    if (service !== undefined) {
      setSelectedService(service)
    }
  }, [services, url])

  useEffect(() => {
    if (selectedService !== undefined) setShowMissingServiceError(false)
  }, [selectedService])

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault()
        if (selectedService !== undefined) {
          onSubmit(url, selectedService, capitalization)
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
            Capitalization{' '}
            <select
              value={capitalization}
              onChange={(event) =>
                setCapitalization(
                  (event.target as HTMLSelectElement)
                    .value as CapitalizationType
                )
              }
            >
              {CAPITALIZATION_TYPES.map((capType) => (
                <option value={capType} key={capType}>
                  {CAPITALIZATION_TYPE_MAP[capType]}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      <input type='submit' value={submitText} className={styles.submit} />
    </form>
  )
}
