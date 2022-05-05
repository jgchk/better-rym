import Icon from '../../../../res/svg/beatport.svg'
import { withCache } from '../../utils/cache'
import { Resolvable, Service } from '../types'
import { resolve } from './resolve'

export const Beatport: Service & Resolvable = {
  id: 'beatport',
  name: 'Beatport',
  regex: /https?:\/\/www\.beatport\.com\/release\/.+\/(\d+)/,
  icon: Icon,
  resolve: withCache('beatport-resolve', resolve),
}
