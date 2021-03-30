import icon from '../../../../res/bandcamp.svg'
import { withCache } from '../../utils/cache'
import { Embeddable, Resolvable, Searchable, Service } from '../types'
import { embed } from './embed'
import { resolve } from './resolve'
import { search } from './search'

export const Bandcamp: Service & Searchable & Resolvable & Embeddable = {
  id: 'bandcamp',
  name: 'Bandcamp',
  regex: /https?:\/\/.*\.bandcamp\.com\/(track|album)\/.*/,
  icon,
  search: withCache('bandcamp', 'search', search),
  resolve: withCache('bandcamp', 'resolve', resolve),
  embed: withCache('bandcamp', 'embed', embed),
}
