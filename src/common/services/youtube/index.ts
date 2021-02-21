import { Service } from '..'
import icon from '../../../../res/youtube.svg'
import { regex } from './regex'
import { resolve } from './resolve'
import { search } from './search'

export const YouTube: Service = {
  id: 'youtube',
  name: 'YouTube',
  regex,
  icon,
  search,
  resolve,
}
