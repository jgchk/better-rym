import { h, VNode } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import {
  CAPITALIZATION_TYPES,
  CapitalizationType,
} from '../../release-submission/utils/capitalization'
import { ReleaseOptions } from '../../release-submission/utils/types'
import { getMatchingService } from '../services'
import { Service } from '../services/types'
import styles from '../styles/form.module.css'
import { ServiceSelector } from './service-selector'

const CAPITALIZATION_TYPE_MAP: Record<CapitalizationType, string> = {
  'title-case': 'Title Case',
  'sentence-case': 'Sentence case',
  'as-is': 'Keep as-is',
}

const FIELDS_MAP: Record<string, string> = {
  artists: 'Artists',
  type: 'Release Type',
  date: 'Release Date',
  title: 'Title',
  format: 'Issued Format',
  discSize: 'Disc Size',
  label: 'Label',
  attributes: 'Issue Attributes',
  tracks: 'Tracklist',
}

export type Properties<S extends Service> = {
  services: S[]
  submitText: string
  onSubmit: (url: string, service: S, options: ReleaseOptions) => void
  showAutoCapitalize?: boolean
}

export const Form = <S extends Service>({
  services,
  submitText,
  onSubmit,
  showAutoCapitalize = false,
}: Properties<S>): VNode => {
  const _fillers: { [x: string]: boolean } = {}
  Object.keys(FIELDS_MAP).map((field) => (_fillers[field] = true))

  const [fillers, setFillers] = useState(_fillers)
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
          onSubmit(url, selectedService, {
            capitalization: capitalization,
            fillFields: fillers,
          } as ReleaseOptions)
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
          <details>
            <summary style='text-align:center'>Advanced Options</summary>
            <div
              id='brym-release-options'
              style='margin-top:0.5em;'
              className={styles.input}
            >
              <hr style='width:100%;margin-bottom:0.5em' />
              <label htmlFor='brym-capitalize'>
                Capitalization:&nbsp;
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
              {Object.keys(FIELDS_MAP).map((field) => (
                <label key={field}>
                  {FIELDS_MAP[field]}:&nbsp;
                  <input
                    id={`brym-${field}`}
                    type='checkbox'
                    checked={fillers[field]}
                    onChange={(event) =>
                      setFillers((previousState) => {
                        const checkbox = event.target as HTMLInputElement
                        const newState = previousState
                        newState[checkbox.id.slice(5)] = checkbox.checked
                        return newState
                      })
                    }
                  />
                </label>
              ))}
            </div>
          </details>
        )}
      </div>
      <input type='submit' value={submitText} className={styles.submit} />
    </form>
  )
}
