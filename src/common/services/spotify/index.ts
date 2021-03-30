import icon from '../../../../res/spotify.svg'
import { withCache } from '../../utils/cache'
import { Resolvable, Searchable, Service } from '../types'
import { regex } from './regex'
import { resolve } from './resolve'
import { search } from './search'

export const Spotify: Service & Searchable & Resolvable = {
  id: 'spotify',
  name: 'Spotify',
  regex,
  icon,
  search: withCache('spotify', 'search', search),
  resolve: withCache('spotify', 'resolve', resolve),
}
