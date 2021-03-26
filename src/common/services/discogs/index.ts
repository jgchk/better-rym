import icon from '../../../../res/discogs.svg'
import { Resolvable, Service } from '../types'
import { regex } from './regex'
import { resolve } from './resolve'

export const Discogs: Service & Resolvable = {
  id: 'discogs',
  name: 'Discogs',
  regex,
  icon,
  resolve,
}
