import { h, render } from 'preact'

import { waitForElement } from '../../common/utils/dom'
import { App } from './components/app'

const main = async () => {
  const siblingElement = await waitForElement('.ui_breadcrumb_frame')

  // filtering doesn't work when you have a tag selected
  if (document.URL.includes('stag')) return

  const app = document.createElement('div')
  app.id = 'better-rym'
  siblingElement.after(app)

  render(<App />, app)
}

void main()
