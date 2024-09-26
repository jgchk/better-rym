import BandcampIcon from '../../icons/bandcamp'
import BandcampFoundIcon from '../../icons/bandcamp-found'
import BandcampNotFoundIcon from '../../icons/bandcamp-notfound'
import { withCache } from '../../utils/cache'
import { Embeddable, Resolvable, Searchable, Service } from '../types'
import { embed } from './embed'
import { resolve } from './resolve'
import { search } from './search'

export const Bandcamp: Service & Searchable & Resolvable & Embeddable = {
  id: 'bandcamp',
  name: 'Bandcamp',
  regex: /https?:\/\/.*\.bandcamp\.com\/(track|album)\/.*/,
  icon: BandcampIcon,
  foundIcon: BandcampFoundIcon,
  notFoundIcon: BandcampNotFoundIcon,
  search: withCache('bandcamp-search', search),
  resolve: withCache('bandcamp-resolve', resolve),
  embed: withCache('bandcamp-embed', embed),
}
