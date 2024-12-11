import SpotifyIcon from '../../icons/spotify'
import SpotifyFoundIcon from '../../icons/spotify-found'
import SpotifyNotFoundIcon from '../../icons/spotify-notfound'
import { withCache } from '../../utils/cache'
import type { Resolvable, Searchable, Service } from '../types'
import { regex } from './regex'
import { resolve } from './resolve'
import { search } from './search'

export const Spotify: Service & Searchable & Resolvable = {
  id: 'spotify',
  name: 'Spotify',
  regex,
  icon: SpotifyIcon,
  foundIcon: SpotifyFoundIcon,
  notFoundIcon: SpotifyNotFoundIcon,
  search: withCache('spotify-search', search),
  resolve,
}
