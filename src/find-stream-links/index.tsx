import { h, render } from 'preact'
import { waitForElement } from '../common/utils/dom'
import { App } from './components/app'

const main = async () => {
  const siblingElement = await waitForElement(
    '.hide-for-small [style="margin-top:8px;"]'
  ).catch(() => document.querySelector('.hide-for-small a[href^="buy"]'))
  if (!siblingElement)
    throw new Error('Could not find insertion point for BetterRYM')

  const app = document.createElement('div')
  app.id = 'better-rym'
  siblingElement.after(app)

  render(<App />, app)
}

void main()
