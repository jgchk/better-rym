import clsx from 'clsx'
import { FunctionComponent, h } from 'preact'
import { useCallback, useEffect, useState } from 'preact/hooks'
import {
  SERVICES,
  SERVICE_IDS,
  ServiceId,
  resolve,
} from '../../common/services'
import { isDefined, isUndefined } from '../../common/utils/types'
import { fill } from '../utils/fillers'
import styles from './app.module.css'

export const App: FunctionComponent = () => {
  const [url, setUrl] = useState('')
  const [selectedServiceId, setServiceId] = useState<ServiceId | undefined>(
    undefined
  )

  const guessService = useCallback((url: string) => {
    const service = Object.values(SERVICES).find((service) =>
      service.regex.test(url)
    )
    if (isDefined(service)) {
      setServiceId(service.id)
    }
  }, [])
  useEffect(() => guessService(url), [guessService, url])

  const autoFill = async (url: string, serviceId: ServiceId) => {
    const info = await resolve(url, serviceId)
    console.log(info)
    fill(info)
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
            if (isDefined(selectedServiceId)) {
              void autoFill(url, selectedServiceId)
            } else {
              throw new Error('Must select a service')
            }
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
          </div>
          <input
            type='submit'
            value='Import'
            disabled={isUndefined(selectedServiceId)}
            className={styles.submit}
          />
        </form>
      </div>
    </>
  )
}
