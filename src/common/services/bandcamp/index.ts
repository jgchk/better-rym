import icon from '../../../../res/bandcamp.svg'
import { Embeddable, Resolvable, Searchable, Service } from '../types'
import { embed } from './embed'
import { resolve } from './resolve'
import { search } from './search'

export const Bandcamp: Service & Searchable & Resolvable & Embeddable = {
  id: 'bandcamp',
  name: 'Bandcamp',
  regex: /https?:\/\/.*\.bandcamp\.com\/(track|album)\/.*/,
  icon,
  search,
  resolve,
  embed,
}
