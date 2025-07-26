import TraxsourceIcon from '../../icons/traxsource'
import { withCache } from '../../utils/cache'
import type { Resolvable, Service } from '../types'
import { resolve } from './resolve'

export const Traxsource: Service & Resolvable = {
  id: 'traxsource',
  name: 'Traxsource',
  regex: /https?:\/\/www\.traxsource\.com\/title\/(\d+)\//,
  icon: TraxsourceIcon,
  resolve: withCache('traxsource-resolve', resolve),
}
