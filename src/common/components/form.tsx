import clsx from 'clsx'
import { FunctionComponent, h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import {
  SERVICES,
  SERVICE_IDS,
  ServiceId,
  getMatchingService,
} from '../services'
import styles from '../styles/form.module.css'
import { isDefined } from '../utils/types'

export const Form: FunctionComponent<{
  submitText: string
  onSubmit: (url: string, serviceId: ServiceId) => void
}> = ({ submitText, onSubmit }) => {
  const [url, setUrl] = useState('')
  const [selectedServiceId, setServiceId] = useState<ServiceId | undefined>(
    undefined
  )
  const [showMissingServiceError, setShowMissingServiceError] = useState(false)

  useEffect(() => {
    const service = getMatchingService(url)
    if (isDefined(service)) {
      setServiceId(service.id)
    }
  }, [url])

  useEffect(() => {
    if (isDefined(selectedServiceId)) {
      setShowMissingServiceError(false)
    }
  }, [selectedServiceId])

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault()
        if (isDefined(selectedServiceId)) {
          onSubmit(url, selectedServiceId)
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
        <div className={styles.icons}>
          {SERVICE_IDS.map((id) => SERVICES[id]).map((service) => (
            <button
              key={service.id}
              type='button'
              onClick={() => setServiceId(service.id)}
              className={clsx(
                styles.icon,
                service.id === selectedServiceId && styles.selected
              )}
            >
              {service.icon({})}
            </button>
          ))}
        </div>
        {showMissingServiceError && (
          <div className={styles.error}>Select an import source</div>
        )}
      </div>
      <input type='submit' value={submitText} className={styles.submit} />
    </form>
  )
}
