import SpotifyIcon from '../../icons/spotify'
import SpotifyFoundIcon from '../../icons/spotify-found'
import SpotifyNotFoundIcon from '../../icons/spotify-notfound'
import { withCache } from '../../utils/cache'
import { Embeddable, Resolvable, Searchable, Service } from '../types'
import { embed } from './embed'
import { resolve } from './resolve'
import { search } from './search'

export const Soundcloud: Service & Searchable & Resolvable & Embeddable = {
  id: 'soundcloud',
  name: 'Soundcloud',
  regex:
    /((http:\/\/(soundcloud\.com\/.*|soundcloud\.com\/.*\/.*|soundcloud\.com\/.*\/sets\/.*|soundcloud\.com\/groups\/.*|snd\.sc\/.*))|(https:\/\/(soundcloud\.com\/.*|soundcloud\.com\/.*\/.*|soundcloud\.com\/.*\/sets\/.*|soundcloud\.com\/groups\/.*)))/,
  icon: SpotifyIcon,
  foundIcon: SpotifyFoundIcon,
  notFoundIcon: SpotifyNotFoundIcon,
  search: withCache('soundcloud-search', search),
  resolve: withCache('soundcloud-resolve', resolve),
  embed: withCache('soundcloud-embed', embed),
}
