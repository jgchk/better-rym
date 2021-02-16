import { Component, createSignal } from 'solid-js'
import { autoFill } from '../utils/form'

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
            autoFill(getUrl())
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
