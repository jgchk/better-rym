import { Service } from '..'
import icon from '../../../../res/applemusic.svg'
import { resolve } from './resolve'
import { search } from './search'

export const AppleMusic: Service = {
  id: 'applemusic',
  name: 'Apple Music',
  icon,
  search,
  resolve,
}
