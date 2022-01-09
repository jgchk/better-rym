import Icon from '../../../../res/svg/spotify.svg'
import FoundIcon from '../../../../res/svg/spotify-found.svg'
import NotFoundIcon from '../../../../res/svg/spotify-notfound.svg'
import { withCache } from '../../utils/cache'
import { Resolvable, Searchable, Service } from '../types'
import { regex } from './regex'
import { resolve } from './resolve'
import { search } from './search'

export const Spotify: Service & Searchable & Resolvable = {
  id: 'spotify',
  name: 'Spotify',
  regex,
  icon: Icon,
  foundIcon: FoundIcon,
  notFoundIcon: NotFoundIcon,
  search: withCache('spotify', 'search', search),
  resolve: withCache('spotify', 'resolve', resolve),
}
