import { Service } from '..'
import icon from '../../../../res/soundcloud.svg'
import { resolve } from './resolve'
import { search } from './search'

export const Soundcloud: Service = {
  id: 'soundcloud',
  name: 'Soundcloud',
  icon,
  search,
  resolve,
}
