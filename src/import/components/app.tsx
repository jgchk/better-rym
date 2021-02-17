import { Component, For, createSignal } from 'solid-js'
import { SERVICES, Service, resolve } from '../../common/services'
import { fill } from '../utils/fillers'

export const App: Component = () => {
  const [getUrl, setUrl] = createSignal('')
  const [getService, setService] = createSignal<Service>(SERVICES[0])

  const autoFill = async (url: string) => {
    const info = await resolve(url, getService())
    console.log(info)
    fill(info)
  }

  return (
    <>
      <div class='submit_step_header'>
        Step 0: <span class='submit_step_header_title'>Import</span>
      </div>
      <div class='submit_step_box'>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            void autoFill(getUrl())
          }}
        >
          <input
            type='url'
            value={getUrl()}
            required
            onChange={(event) => setUrl(event.target.value)}
          />
          <select
            value={getService()}
            onChange={(event) => setService(event.target.value as Service)}
          >
            <For each={SERVICES}>
              {(service) => <option value={service}>{service}</option>}
            </For>
          </select>
          <input type='submit' value='Import' />
        </form>
      </div>
    </>
  )
}
