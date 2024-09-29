import AppleMusicIcon from '../../icons/applemusic'
import AppleMusicFoundIcon from '../../icons/applemusic-found'
import AppleMusicNotFoundIcon from '../../icons/applemusic-notfound'
import { withCache } from '../../utils/cache'
import type { Resolvable, Searchable, Service } from '../types'
import { resolve } from './resolve'
import { search } from './search'

export const AppleMusic: Service & Searchable & Resolvable = {
  id: 'applemusic',
  name: 'Apple Music',
  regex:
    /https?:\/\/music\.apple\.com\/(\w{2,4})\/(album|music-video)\/([^/]*)\/([^?]+)[^/]*/,
  icon: AppleMusicIcon,
  foundIcon: AppleMusicFoundIcon,
  notFoundIcon: AppleMusicNotFoundIcon,
  search: withCache('applemusic-search', search),
  resolve: withCache('applemusic-resolve', resolve),
}
