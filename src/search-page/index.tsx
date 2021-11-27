import { h, render } from 'preact'

import { isTuple } from '../common/utils/array'
import { waitForElement } from '../common/utils/dom'
import { fetch } from '../common/utils/fetch'
import { pipe } from '../common/utils/pipe'
import { ifDefined } from '../common/utils/types'
import { DDG } from './components/ddg'

const main = async () => {
  const contentWrapper = await waitForElement('#content .row')
  contentWrapper.innerHTML = ''
  render(<DDG />, contentWrapper)
}

void main()
