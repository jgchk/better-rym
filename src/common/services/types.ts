import { FunctionComponent, JSX } from 'preact'

import { Metadata } from '../../find-stream-links/utils/page-data'

export const SERVICE_IDS = [
  'applemusic',
  'bandcamp',
  'discogs',
  'soundcloud',
  'spotify',
  'youtube',
  'melon',
] as const

export type ServiceId = typeof SERVICE_IDS[number]
export type Service = {
  id: ServiceId
  name: string
  icon: Icon
  regex: RegExp
}
export type Icon = FunctionComponent<JSX.SVGAttributes<SVGSVGElement>>

export type SearchFunction = (metadata: Metadata) => Promise<string | undefined>
export type Searchable = {
  search: SearchFunction
  foundIcon: Icon
  notFoundIcon: Icon
}
export const isSearchable = (
  service: Service | (Service & Searchable)
): service is Service & Searchable => 'search' in service

export type ResolveFunction = (url: string) => Promise<ResolveData>
export type Resolvable = { resolve: ResolveFunction }
export const isResolvable = (
  service: Service | (Service & Resolvable)
): service is Service & Resolvable => 'resolve' in service

export type EmbedFunction = (url: string) => Promise<string | undefined>
export type Embeddable = { embed: EmbedFunction }
export const isEmbeddable = (
  service: Service | (Service & Embeddable)
): service is Service & Embeddable => 'embed' in service

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
  | 'music video'
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
export type DiscSize =
  | '16'
  | '12'
  | '11'
  | '10'
  | '9'
  | '8'
  | '7'
  | '6'
  | '5'
  | '4'
  | '3'
  | 'non-standard'
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
export type ReleaseLabel = { name?: string; catno?: string }
export type Track = { position?: string; title?: string; duration?: string }
export type ResolveData = {
  url?: string
  title?: string
  artists?: string[]
  coverArt?: string[]
  date?: ReleaseDate
  type?: ReleaseType
  label?: ReleaseLabel
  format?: ReleaseFormat
  discSize?: DiscSize
  attributes?: ReleaseAttribute[]
  tracks?: Track[]
}
