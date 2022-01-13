import { h, render } from 'preact'

import { waitForElement } from '../common/utils/dom'
import { App } from './components/app'

const main = async () => {
  const app = document.createElement('div')
  app.id = 'better-rym'

  try {
    const siblingElement = await waitForElement(
      '.hide-for-small a[href^="/submit_media_link"]'
    )
    siblingElement.before(app)
  } catch {
    const siblingElement = await waitForElement(
      '.page_release_art_frame .hide-for-small'
    )
    siblingElement.append(app)
  }

  render(<App />, app)
}

void main()
