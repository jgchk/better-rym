import { render } from 'solid-js/web'
import { waitForElement } from '../common/utils/dom'
import App from './components/app'

const main = async () => {
  const siblingElement = await waitForElement('.submit_step_header')

  const app = document.createElement('div')
  app.id = 'better-rym'
  siblingElement.before(app)

  render(() => App({}), app)
}

void main()
