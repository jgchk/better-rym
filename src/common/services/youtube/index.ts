import YoutubeIcon from '../../icons/youtube'
import YoutubeFoundIcon from '../../icons/youtube-found'
import YoutubeNotFoundIcon from '../../icons/youtube-notfound'
import { withCache } from '../../utils/cache'
import { Resolvable, Searchable, Service } from '../types'
import { regex } from './regex'
import { resolve } from './resolve'
import { search } from './search'

export const YouTube: Service & Searchable & Resolvable = {
  id: 'youtube',
  name: 'YouTube',
  regex,
  icon: YoutubeIcon,
  foundIcon: YoutubeFoundIcon,
  notFoundIcon: YoutubeNotFoundIcon,
  search: withCache('youtube-search', search),
  resolve: withCache('youtube-resolve', resolve),
}
