import icon from '../../../../res/spotify.svg'
import { Resolvable, Searchable, Service } from '../types'
import { regex } from './regex'
import { resolve } from './resolve'
import { search } from './search'

export const Spotify: Service & Searchable & Resolvable = {
  id: 'spotify',
  name: 'Spotify',
  regex,
  icon,
  search,
  resolve,
}
