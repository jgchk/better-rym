import clsx from 'clsx'
import { FunctionComponent, h } from 'preact'
import { useState } from 'preact/hooks'
import {
  SERVICES,
  SERVICE_IDS,
  ServiceId,
  resolve,
} from '../../common/services'
import { fill } from '../utils/fillers'
import styles from './app.module.css'

export const App: FunctionComponent = () => {
  const [url, setUrl] = useState('')
  const [selectedServiceId, setServiceId] = useState<ServiceId>(SERVICE_IDS[0])

  const autoFill = async (url: string) => {
    const info = await resolve(url, selectedServiceId)
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
            void autoFill(url)
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
          <input type='submit' value='Import' className={styles.submit} />
        </form>
      </div>
    </>
  )
}
