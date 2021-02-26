import { FunctionComponent, h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { ServiceId, getMatchingService } from '../services'
import styles from '../styles/form.module.css'
import { isDefined } from '../utils/types'
import { ServiceSelector } from './service-selector'

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
        <ServiceSelector
          serviceId={selectedServiceId}
          onSelect={setServiceId}
        />
        {showMissingServiceError && (
          <div className={styles.error}>Select an import source</div>
        )}
      </div>
      <input type='submit' value={submitText} className={styles.submit} />
    </form>
  )
}
