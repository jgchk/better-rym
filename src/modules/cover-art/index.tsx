import { h, render } from 'preact'

import { waitForElement } from '../../common/utils/dom'
import { CoverArtDownloader } from './cover-art-downloader'

export async function injectCoverArtDownloader() {
  const siblingElement = await waitForElement('#content_total_cover')

  const app = document.createElement('div')
  app.id = 'better-rym'
  siblingElement.after(app)

  render(<CoverArtDownloader />, app)
}
