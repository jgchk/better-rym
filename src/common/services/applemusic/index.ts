import icon from '../../../../res/applemusic.svg'
import { withCache } from '../../utils/cache'
import { Resolvable, Searchable, Service } from '../types'
import { resolve } from './resolve'
import { search } from './search'

export const AppleMusic: Service & Searchable & Resolvable = {
  id: 'applemusic',
  name: 'Apple Music',
  regex: /https?:\/\/music\.apple\.com\/(\w{2,4})\/album\/([^/]*)\/([^?]+)[^/]*/,
  icon,
  search: withCache('applemusic', 'search', search),
  resolve: withCache('applemusic', 'resolve', resolve),
}
