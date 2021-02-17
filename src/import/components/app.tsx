import { Component, createSignal } from 'solid-js'
import { resolve } from '../../common/services'
import { fill } from '../utils/fillers'

const autoFill = async (url: string) => {
  const info = await resolve(url, 'applemusic')
  fill(info)
}

export const App: Component = () => {
  const [getUrl, setUrl] = createSignal('')

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
          <input type='submit' value='Import' />
        </form>
      </div>
    </>
  )
}
