import { h, render } from 'preact'

import { waitForElement } from '../../common/utils/dom'
import { Import } from './components/import'
import injectDateControls from './use-cases/date-controls'
import injectCatalogNumberControls from './use-cases/catalog-number-controls'
import injectLabelControls from './use-cases/label-controls'
import injectCreditsControls from './use-cases/credits-controls'
import injectFileUnderControls from './use-cases/file-under-controls'
import injectTracklistControls from './use-cases/tracklist-controls'

const injectImport = async () => {
  const siblingElement = await waitForElement('.submit_step_header')
  const app = document.createElement('div')
  app.id = 'better-rym'
  siblingElement.before(app)
  render(<Import />, app)
}

export const main = () =>
  Promise.all([
    injectImport(),
    injectTracklistControls(),
    injectFileUnderControls(),
    injectCreditsControls(),
    injectLabelControls(),
    injectCatalogNumberControls(),
    injectDateControls(),
  ])
