import { h, render } from 'preact'

import { Options } from './components/options'

const div = document.createElement('div')
document.body.append(div)

render(<Options />, div)
