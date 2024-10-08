import DiscogsIcon from '../../icons/discogs'
import { withCache } from '../../utils/cache'
import type { Resolvable, Service } from '../types'
import { regex } from './regex'
import { resolve } from './resolve'

export const Discogs: Service & Resolvable = {
  id: 'discogs',
  name: 'Discogs',
  regex,
  icon: DiscogsIcon,
  resolve: withCache('discogs-resolve', resolve),
}
