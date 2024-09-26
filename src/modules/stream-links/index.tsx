import { h, render } from 'preact'

import { waitForElement } from '../../common/utils/dom'
import { App } from './components/app'

export const main = async () => {
  const app = document.createElement('div')
  app.id = 'better-rym'

  try {
    const siblingElement = await waitForElement(
      '.hide-for-small a[href^="buy"]'
    )
    siblingElement.after(app)
  } catch {
    const siblingElement = await waitForElement(
      '.page_release_art_frame .hide-for-small'
    )
    siblingElement.prepend(app)
  }

  render(<App />, app)
}
