import { Embeddable, Service } from '..'
import icon from '../../../../res/bandcamp.svg'
import { embed } from './embed'
import { resolve } from './resolve'
import { search } from './search'

export const Bandcamp: Service & Embeddable = {
  id: 'bandcamp',
  name: 'Bandcamp',
  regex: /https?:\/\/.*\.bandcamp\.com\/(track|album)\/.*/,
  icon,
  search,
  resolve,
  embed,
}
