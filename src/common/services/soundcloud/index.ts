import { Embeddable, Service } from '..'
import icon from '../../../../res/soundcloud.svg'
import { embed } from './embed'
import { resolve } from './resolve'
import { search } from './search'

export const Soundcloud: Service & Embeddable = {
  id: 'soundcloud',
  name: 'Soundcloud',
  regex: /((http:\/\/(soundcloud\.com\/.*|soundcloud\.com\/.*\/.*|soundcloud\.com\/.*\/sets\/.*|soundcloud\.com\/groups\/.*|snd\.sc\/.*))|(https:\/\/(soundcloud\.com\/.*|soundcloud\.com\/.*\/.*|soundcloud\.com\/.*\/sets\/.*|soundcloud\.com\/groups\/.*)))/,
  icon,
  search,
  resolve,
  embed,
}
