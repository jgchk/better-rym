import FoundIcon from '../../../../res/soundcloud-found.svg'
import NotFoundIcon from '../../../../res/soundcloud-notfound.svg'
import Icon from '../../../../res/soundcloud.svg'
import { withCache } from '../../utils/cache'
import { Embeddable, Resolvable, Searchable, Service } from '../types'
import { embed } from './embed'
import { resolve } from './resolve'
import { search } from './search'

export const Soundcloud: Service & Searchable & Resolvable & Embeddable = {
  id: 'soundcloud',
  name: 'Soundcloud',
  regex:
    /((http:\/\/(soundcloud\.com\/.*|soundcloud\.com\/.*\/.*|soundcloud\.com\/.*\/sets\/.*|soundcloud\.com\/groups\/.*|snd\.sc\/.*))|(https:\/\/(soundcloud\.com\/.*|soundcloud\.com\/.*\/.*|soundcloud\.com\/.*\/sets\/.*|soundcloud\.com\/groups\/.*)))/,
  icon: Icon,
  foundIcon: FoundIcon,
  notFoundIcon: NotFoundIcon,
  search: withCache('soundcloud', 'search', search),
  resolve: withCache('soundcloud', 'resolve', resolve),
  embed: withCache('soundcloud', 'embed', embed),
}
