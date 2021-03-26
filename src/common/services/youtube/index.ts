import icon from '../../../../res/youtube.svg'
import { Resolvable, Searchable, Service } from '../types'
import { regex } from './regex'
import { resolve } from './resolve'
import { search } from './search'

export const YouTube: Service & Searchable & Resolvable = {
  id: 'youtube',
  name: 'YouTube',
  regex,
  icon,
  search,
  resolve,
}
