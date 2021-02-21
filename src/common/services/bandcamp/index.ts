import { Service } from '..'
import icon from '../../../../res/bandcamp.svg'
import { resolve } from './resolve'
import { search } from './search'

export const Bandcamp: Service = {
  id: 'bandcamp',
  name: 'Bandcamp',
  icon,
  search,
  resolve,
}
