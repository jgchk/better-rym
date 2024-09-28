import { h, render } from 'preact'

import { waitForElement } from '../../common/utils/dom'
import { FilterButtons } from './filter-buttons'

export async function injectCollectionFilterButtons() {
  const siblingElement = await waitForElement('.ui_breadcrumb_frame')

  // filtering doesn't work when you have a tag selected
  if (document.URL.includes('stag')) return

  const app = document.createElement('div')
  app.id = 'better-rym'
  siblingElement.after(app)

  const showReleaseTypes = !window.location.href.includes('film_collection')

  render(<FilterButtons showReleaseTypes={showReleaseTypes} />, app)
}
