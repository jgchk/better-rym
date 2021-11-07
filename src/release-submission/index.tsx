import { h, render } from 'preact'

import { waitForElement } from '../common/utils/dom'
import { Credits } from './components/credits'
import { Import } from './components/import'
import { NoLabel } from './components/no-label'
import { UnknownArtist } from './components/unknown-artist'

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

  const lengthScript = document.createAttribute('onclick')
  lengthScript.value =
    'if(confirm("Are you sure?")) { clearAllRows("track_track_length");}'

  lengthClear.attributes.setNamedItem(lengthScript)
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

const injectLabel = async () => {
  const label = await waitForElement('#labellist')
  const noLabelDiv = document.createElement('div')
  label.after(noLabelDiv)
  render(<NoLabel />, noLabelDiv)
}

const main = () =>
  Promise.all([
    injectImport(),
    injectClearTracklist(),
    injectFileUnder(),
    injectCredits(),
    injectLabel(),
  ])

void main()
