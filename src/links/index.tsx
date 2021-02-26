import { h, render } from 'preact'
import { waitForElement } from '../common/utils/dom'
import { App } from './components/app'

const main = async () => {
  const input = await waitForElement<HTMLInputElement>('input#form_media_url')

  const app = document.createElement('div')
  app.id = 'better-rym'
  input.after(app)

  render(<App input={input} />, app)
}

void main()
