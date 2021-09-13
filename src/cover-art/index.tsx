import { h, render } from 'preact'

import { waitForElement } from '../common/utils/dom'
import { App } from './components/app'

const main = async () => {
  const siblingElement = await waitForElement('#content_total_cover')

  const app = document.createElement('div')
  app.id = 'better-rym'
  siblingElement.after(app)

  render(<App />, app)
}

void main()
