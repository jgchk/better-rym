import clsx from 'clsx'
import { FunctionComponent, h } from 'preact'
import { useCallback, useEffect, useState } from 'preact/hooks'
import {
  SERVICES,
  SERVICE_IDS,
  ServiceId,
  resolve,
} from '../../common/services'
import { isDefined } from '../../common/utils/types'
import { fill } from '../utils/fillers'
import styles from './app.module.css'

export const App: FunctionComponent = () => {
  const [url, setUrl] = useState('')
  const [selectedServiceId, setServiceId] = useState<ServiceId | undefined>(
    undefined
  )

  const [error, setError] = useState<string | undefined>(undefined)

  const guessService = useCallback((url: string) => {
    const service = Object.values(SERVICES).find((service) =>
      service.regex.test(url)
    )
    if (isDefined(service)) {
      setServiceId(service.id)
    }
  }, [])
  useEffect(() => guessService(url), [guessService, url])
  useEffect(() => {
    if (isDefined(selectedServiceId)) setError(undefined)
  }, [selectedServiceId])

  const autoFill = async () => {
    if (isDefined(selectedServiceId)) {
      const info = await resolve(url, selectedServiceId)
      console.log(info)
      fill(info)
    } else {
      setError('Select an import source')
    }
  }

  return (
    <>
      <div className='submit_step_header'>
        Step 0: <span className='submit_step_header_title'>Import</span>
      </div>
      <div className='submit_step_box'>
        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault()
            void autoFill()
          }}
        >
          <div className={styles.input}>
            <input
              type='url'
              value={url}
              required
              onInput={(event) =>
                setUrl((event.target as HTMLInputElement).value)
              }
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
            {error && <div className={styles.error}>{error}</div>}
          </div>
          <input type='submit' value='Import' className={styles.submit} />
        </form>
      </div>
    </>
  )
}
