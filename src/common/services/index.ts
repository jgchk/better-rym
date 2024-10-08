import { AppleMusic } from './applemusic'
import { Bandcamp } from './bandcamp'
import { Beatport } from './beatport'
import { Discogs } from './discogs'
import { Melon } from './melon'
import { Soundcloud } from './soundcloud'
import { Spotify } from './spotify'
import type { Embeddable, Resolvable, Searchable, Service } from './types'
import { isEmbeddable, isResolvable, isSearchable } from './types'
import { YouTube } from './youtube'

export const SERVICES: Service[] = [
  AppleMusic,
  Bandcamp,
  Discogs,
  Soundcloud,
  Spotify,
  YouTube,
  Melon,
  Beatport,
]

export const SEARCHABLES: (Service & Searchable)[] =
  SERVICES.filter(isSearchable)
export const RESOLVABLES: (Service & Resolvable)[] =
  SERVICES.filter(isResolvable)
export const EMBEDDABLES: (Service & Embeddable)[] =
  SERVICES.filter(isEmbeddable)

export const getMatchingService =
  <S extends Service>(services: S[]) =>
  (url: string): S | undefined =>
    services.find((service) => service.regex.test(url))
