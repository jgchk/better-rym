import injectDateControls from './use-cases/date-controls'
import injectCatalogNumberControls from './use-cases/catalog-number-controls'
import injectLabelControls from './use-cases/label-controls'
import injectCreditsControls from './use-cases/credits-controls'
import injectFileUnderControls from './use-cases/file-under-controls'
import injectTracklistControls from './use-cases/tracklist-controls'
import injectImportControls from './use-cases/import-controls'

export const main = () =>
  Promise.all([
    injectImportControls(),
    injectTracklistControls(),
    injectFileUnderControls(),
    injectCreditsControls(),
    injectLabelControls(),
    injectCatalogNumberControls(),
    injectDateControls(),
  ])
