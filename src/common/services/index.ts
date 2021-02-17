import iconAppleMusic from '../../../res/applemusic.svg'
import iconBandcamp from '../../../res/bandcamp.svg'
import iconSoundcloud from '../../../res/soundcloud.svg'
import iconSpotify from '../../../res/spotify.svg'
import iconYoutube from '../../../res/youtube.svg'
import { Metadata } from '../../release/utils/page-data'
import {
  resolve as resolveAppleMusic,
  search as searchAppleMusic,
} from './applemusic'
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

export const ICONS: Record<Service, string> = {
  applemusic: iconAppleMusic,
  bandcamp: iconBandcamp,
  soundcloud: iconSoundcloud,
  spotify: iconSpotify,
  youtube: iconYoutube,
}

export type SearchFunction = (metadata: Metadata) => Promise<string | undefined>
export const SEARCH_FUNCTIONS: Record<Service, SearchFunction> = {
  applemusic: searchAppleMusic,
  bandcamp: searchBandcamp,
  soundcloud: searchSoundcloud,
  spotify: searchSpotify,
  youtube: searchYoutube,
}
export const search = (
  metadata: Metadata,
  service: Service
): Promise<string | undefined> => SEARCH_FUNCTIONS[service](metadata)

export type ReleaseDate = {
  year?: number
  month?: number
  day?: number
}
export type ReleaseType =
  | 'album'
  | 'compilation'
  | 'ep'
  | 'single'
  | 'mixtape'
  | 'dj mix'
  | 'bootleg'
  | 'video'
export type ReleaseFormat =
  | 'digital file'
  | 'lossless digital'
  | 'blu-ray'
  | 'cd'
  | 'cd-r'
  | 'dualdisc'
  | 'dvd'
  | 'dvd-a'
  | 'dvd-r'
  | 'hdad'
  | 'hdcd'
  | 'laserdisc'
  | 'minidisc'
  | 'sacd'
  | 'umd'
  | 'vcd'
  | 'vinyl'
  | 'shellac'
  | '8 track'
  | '4 track'
  | 'acetate'
  | 'beta'
  | 'cassette'
  | 'dat'
  | 'dcc'
  | 'microcasette'
  | 'playtape'
  | 'reel-to-reel'
  | 'vhs'
  | 'phonograph cylinder'
export type ReleaseAttribute =
  | 'abridged'
  | 'bonus cd'
  | 'bonus dvd'
  | 'bonus flash drive'
  | 'bonus tracks'
  | 'censored'
  | 'content/copy protected'
  | 'digital download'
  | 'duophonic/electronically rechanneled stereo'
  | 'enhanced cd'
  | 'mono'
  | 'quadraphonic'
  | 'remastered'
  | 're-recorded'
  | 'single-sided'
  | 'anniversary edition'
  | 'box set'
  | "collector's edition"
  | 'deluxe edition'
  | 'demo'
  | 'exclusive'
  | 'fan club release'
  | 'limited edition'
  | 'numbered edition'
  | 'promo'
  | 'unauthorized mixtape/dj mix'
  | 'amaray case'
  | 'cd sized album replica'
  | 'digibook'
  | 'digipak'
  | 'gatefold'
  | 'handmade'
  | 'jewel case'
  | 'musicpac/slidepac'
  | 'no artwork'
  | 'paper/cardboard sleeve'
  | 'slipcase/o-card'
  | 'usb/flash drive'
  | 'colored vinyl'
  | 'etched'
  | 'flexi-disc'
  | 'multi-groove'
  | 'picture disc'
  | 'test pressing'
  | 'white label'
  | '120 gram'
  | '140 gram'
  | '150 gram'
  | '160 gram'
  | '180 gram'
  | '200 gram'
  | '220 gram'
  | '16 rpm'
  | '33 rpm'
  | '45 rpm'
  | '78 rpm'
  | '80 rpm'
  | '3 3/4 ips'
  | '7 1/2 ips'
  | 'gold disc'
  | 'shm'
  | 'downloadable'
  | 'streaming'
  | 'remixes'
  | 'selector comp'
  | 'archival'
  | 'creative commons'
  | 'interview'
  | 'live'
  | 'nsbm/nazi material'
  | 'cast recording'
  | 'film score'
  | 'motion picture soundtrack'
  | 'songs inspired by'
  | 'television soundtrack'
  | 'video game soundtrack'
export type Track = { position?: string; title?: string; duration?: string }
export type ResolveData = {
  url?: string
  title?: string
  date?: ReleaseDate
  type?: ReleaseType
  format?: ReleaseFormat
  attributes?: ReleaseAttribute[]
  tracks?: Track[]
}
export type ResolveFunction = (url: string) => Promise<ResolveData>
export const RESOLVE_FUNCTIONS: Record<Service, ResolveFunction> = {
  applemusic: resolveAppleMusic,
  bandcamp: resolveAppleMusic,
  soundcloud: resolveAppleMusic,
  spotify: resolveAppleMusic,
  youtube: resolveAppleMusic,
}
export const resolve = (url: string, service: Service): Promise<ResolveData> =>
  RESOLVE_FUNCTIONS[service](url)
