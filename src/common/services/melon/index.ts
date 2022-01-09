import Icon from '../../../../res/svg/melon.svg'
import { withCache } from '../../utils/cache'
import { Resolvable, Service } from '../types'
import { resolve } from './resolve'

export const Melon: Service & Resolvable = {
  id: 'melon',
  name: 'Melon',
  regex: /https?:\/\/www\.melon\.com\/album\/detail\.htm\?albumId=\d+/,
  icon: Icon,
  resolve: withCache('melon', 'resolve', resolve),
}
