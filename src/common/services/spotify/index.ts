import { Service } from '..'
import icon from '../../../../res/spotify.svg'
import { resolve } from './resolve'
import { search } from './search'

export const Spotify: Service = {
  id: 'spotify',
  name: 'Spotify',
  icon,
  search,
  resolve,
}
