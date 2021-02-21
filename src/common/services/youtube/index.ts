import { Service } from '..'
import icon from '../../../../res/youtube.svg'
import { resolve } from './resolve'
import { search } from './search'

export const YouTube: Service = {
  id: 'youtube',
  name: 'YouTube',
  icon,
  search,
  resolve,
}
