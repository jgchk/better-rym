import icon from '../../../../res/youtube.svg'
import { withCache } from '../../utils/cache'
import { Resolvable, Searchable, Service } from '../types'
import { regex } from './regex'
import { resolve } from './resolve'
import { search } from './search'

export const YouTube: Service & Searchable & Resolvable = {
  id: 'youtube',
  name: 'YouTube',
  regex,
  icon,
  search: withCache('youtube', search),
  resolve: withCache('youtube', resolve),
}
