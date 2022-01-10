import Icon from '../../../../res/svg/youtube.svg'
import FoundIcon from '../../../../res/svg/youtube-found.svg'
import NotFoundIcon from '../../../../res/svg/youtube-notfound.svg'
import { withCache } from '../../utils/cache'
import { Resolvable, Searchable, Service } from '../types'
import { regex } from './regex'
import { resolve } from './resolve'
import { search } from './search'

export const YouTube: Service & Searchable & Resolvable = {
  id: 'youtube',
  name: 'YouTube',
  regex,
  icon: Icon,
  foundIcon: FoundIcon,
  notFoundIcon: NotFoundIcon,
  search: withCache('youtube-search', search),
  resolve: withCache('youtube-resolve', resolve),
}
