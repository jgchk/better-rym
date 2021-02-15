import { TaskEither } from 'fp-ts/lib/TaskEither'
import { Option } from 'fp-ts/Option'
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

export type SearchFunction = (
  metadata: Metadata
) => TaskEither<Error, Option<string>>

export const SEARCH_FUNCTIONS: Record<Service, SearchFunction> = {
  applemusic: searchAppleMusic,
  bandcamp: searchBandcamp,
  soundcloud: searchSoundcloud,
  spotify: searchSpotify,
  youtube: searchYoutube,
}
