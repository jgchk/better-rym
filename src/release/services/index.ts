import iconAppleMusic from '../../../res/applemusic.svg'
import iconBandcamp from '../../../res/bandcamp.svg'
import iconSoundcloud from '../../../res/soundcloud.svg'
import iconSpotify from '../../../res/spotify.svg'
import iconYoutube from '../../../res/youtube.svg'
import { Metadata } from '../utils/page-data'
import { search as searchAppleMusic } from './applemusic'
import { search as searchBandcamp } from './bandcamp'
import { search as searchSoundcloud } from './soundcloud'
import { search as searchSpotify } from './spotify'
import { search as searchYoutube } from './youtube'

export const SERVICES = [
  'applemusic',
  'bandcamp',
  'soundcloud',
  'spotify',
  'youtube',
] as const

export type Service = typeof SERVICES[number]

export type SearchFunction = (metadata: Metadata) => Promise<string | undefined>

export const SEARCH_FUNCTIONS: Record<Service, SearchFunction> = {
  applemusic: searchAppleMusic,
  bandcamp: searchBandcamp,
  soundcloud: searchSoundcloud,
  spotify: searchSpotify,
  youtube: searchYoutube,
}

export const ICONS: Record<Service, string> = {
  applemusic: iconAppleMusic,
  bandcamp: iconBandcamp,
  soundcloud: iconSoundcloud,
  spotify: iconSpotify,
  youtube: iconYoutube,
}
