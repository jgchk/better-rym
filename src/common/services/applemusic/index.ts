import Icon from '../../../../res/svg/applemusic.svg'
import FoundIcon from '../../../../res/svg/applemusic-found.svg'
import NotFoundIcon from '../../../../res/svg/applemusic-notfound.svg'
import { withCache } from '../../utils/cache'
import { Resolvable, Searchable, Service } from '../types'
import { resolve } from './resolve'
import { search } from './search'

export const AppleMusic: Service & Searchable & Resolvable = {
  id: 'applemusic',
  name: 'Apple Music',
  regex:
    /https?:\/\/music\.apple\.com\/(\w{2,4})\/(album|music-video)\/([^/]*)\/([^?]+)[^/]*/,
  icon: Icon,
  foundIcon: FoundIcon,
  notFoundIcon: NotFoundIcon,
  search: withCache('applemusic-search', search),
  resolve: withCache('applemusic-resolve', resolve),
}
