import BeatportIcon from '../../icons/beatport'
import { withCache } from '../../utils/cache'
import type { Resolvable, Service } from '../types'
import { resolve } from './resolve'

export const Beatport: Service & Resolvable = {
  id: 'beatport',
  name: 'Beatport',
  regex: /https?:\/\/www\.beatport\.com\/release\/.+\/(\d+)/,
  icon: BeatportIcon,
  resolve: withCache('beatport-resolve', resolve),
}
