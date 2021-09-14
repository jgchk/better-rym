import { h, render } from 'preact'

import { forceQuerySelector, waitForElement } from '../common/utils/dom'
import { App } from './components/app'

const main = async () => {
  const siblingElement = await waitForElement('.submit_step_header')
  await waitForElement('a#clearAll')

  if (document.querySelector('a#clearAllLengths') === null) {
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
    forceQuerySelector(document)('a#clearAll').after(lengthClear)
  }

  const app = document.createElement('div')
  app.id = 'better-rym'
  siblingElement.before(app)

  render(<App />, app)
}

void main()
