import MelonIcon from '../../icons/melon'
import { withCache } from '../../utils/cache'
import type { Resolvable, Service } from '../types'
import { resolve } from './resolve'

export const Melon: Service & Resolvable = {
  id: 'melon',
  name: 'Melon',
  regex: /https?:\/\/www\.melon\.com\/album\/detail\.htm\?albumId=\d+/,
  icon: MelonIcon,
  resolve: withCache('melon-resolve', resolve),
}
