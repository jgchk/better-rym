import { render } from 'solid-js/web'
import { insertAfter, waitForElement } from '../common/utils/dom'
import App from './components/app'

const main = async () => {
  const siblingElement = await waitForElement(
    '.hide-for-small [style="margin-top:8px;"]'
  )

  const app = document.createElement('div')
  app.id = 'better-rym'
  insertAfter(siblingElement)(app)

  render(() => App({}), app)
}

void main()
