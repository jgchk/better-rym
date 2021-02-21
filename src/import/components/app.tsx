import { FunctionComponent, h } from 'preact'
import { useState } from 'preact/hooks'
import { SERVICE_IDS, ServiceId, resolve } from '../../common/services'
import { fill } from '../utils/fillers'

export const App: FunctionComponent = () => {
  const [url, setUrl] = useState('')
  const [service, setService] = useState<ServiceId>(SERVICE_IDS[0])

  const autoFill = async (url: string) => {
    const info = await resolve(url, service)
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
          onSubmit={(event) => {
            event.preventDefault()
            void autoFill(url)
          }}
        >
          <input
            type='url'
            value={url}
            required
            onInput={(event) =>
              setUrl((event.target as HTMLInputElement).value)
            }
          />
          <select
            value={service}
            onInput={(event) =>
              setService((event.target as HTMLSelectElement).value as ServiceId)
            }
          >
            {SERVICE_IDS.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
          <input type='submit' value='Import' />
        </form>
      </div>
    </>
  )
}
