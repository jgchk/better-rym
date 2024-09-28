import { h, render } from 'preact'

import { forceQuerySelector, waitForElement } from '../../common/utils/dom'
import { Credits } from './components/credits'
import { Import } from './components/import'
import { UnknownArtist } from './components/unknown-artist'
import injectDateControls from './use-cases/date-controls'
import injectCatalogNumberControls from './use-cases/catalog-number-controls'
import injectLabelControls from './use-cases/label-controls'

const injectImport = async () => {
  const siblingElement = await waitForElement('.submit_step_header')
  const app = document.createElement('div')
  app.id = 'better-rym'
  siblingElement.before(app)
  render(<Import />, app)
}

const injectClearTracklist = async () => {
  const clearAll = await waitForElement('a#clearAll')

  const lengthClear = document.createElement('a')
  lengthClear.id = 'clearAllLengths'
  lengthClear.className = 'btn blue_btn btn_small rating_btn'
  lengthClear.href = 'javascript:void(0);'
  lengthClear.style.cssText = 'margin-left: 1em; visibility: visible;'
  lengthClear.textContent = 'clear lengths'

  lengthClear.addEventListener('click', () => {
    const advancedInputContainer = forceQuerySelector(document)('#tracks_adv')
    const isAdvanced =
      window.getComputedStyle(advancedInputContainer).display !== 'none'

    const advancedInput =
      forceQuerySelector<HTMLTextAreaElement>(document)('#track_advanced')

    if (!isAdvanced)
      forceQuerySelector<HTMLAnchorElement>(document)('#goAdvancedBtn').click()

    advancedInput.value = advancedInput.value
      .split('\n')
      .filter((line) => line.length > 0)
      .map((line) => [...line.split('|').slice(0, 2), ''].join('|'))
      .join('\n')

    if (!isAdvanced)
      forceQuerySelector<HTMLAnchorElement>(document)('#goSimpleBtn').click()
  })

  clearAll.after(lengthClear)
}

const injectFileUnder = async () => {
  const fileUnder = await waitForElement('#filed_underlist')
  const unknownArtistDiv = document.createElement('div')
  fileUnder.after(unknownArtistDiv)
  render(<UnknownArtist target='filedunder' />, unknownArtistDiv)
}

const injectCredits = async () => {
  const credits = await waitForElement('#creditlist')
  const unknownArtistDiv = document.createElement('div')
  credits.after(unknownArtistDiv)
  render(<Credits />, unknownArtistDiv)
}

export const main = () =>
  Promise.all([
    injectImport(),
    injectClearTracklist(),
    injectFileUnder(),
    injectCredits(),
    injectLabelControls(),
    injectCatalogNumberControls(),
    injectDateControls(),
  ])
