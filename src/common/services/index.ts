import * as cache from '../utils/cache'
import { isDefined } from '../utils/types'
import { AppleMusic } from './applemusic'
import { Bandcamp } from './bandcamp'
import { Discogs } from './discogs'
import { Soundcloud } from './soundcloud'
import { Spotify } from './spotify'
import {
  Embeddable,
  Resolvable,
  Searchable,
  Service,
  ServiceId,
  isEmbeddable,
  isResolvable,
  isSearchable,
} from './types'
import { YouTube } from './youtube'

export const SERVICES: Service[] = [
  AppleMusic,
  Bandcamp,
  Discogs,
  Soundcloud,
  Spotify,
  YouTube,
]

export const SEARCHABLES: (Service & Searchable)[] = SERVICES.filter(
  isSearchable
)
export const RESOLVABLES: (Service & Resolvable)[] = SERVICES.filter(
  isResolvable
)
export const EMBEDDABLES: (Service & Embeddable)[] = SERVICES.filter(
  isEmbeddable
)

export const useCache = <A, T>(
  serviceId: ServiceId,
  function_: (...arguments_: A[]) => T | Promise<T>
) => async (...arguments_: A[]): Promise<T> => {
  const key = JSON.stringify({
    service: serviceId,
    func: function_.name,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    params: function_.arguments,
  })
  const cached = await cache.get<T>(key)
  if (isDefined(cached)) {
    return cached
  }

  const result = await function_(...arguments_)

  if (isDefined(result)) {
    void cache.set(key, result)
  }

  return result
}

export const getMatchingService = <S extends Service>(services: S[]) => (
  url: string
): S | undefined => services.find((service) => service.regex.test(url))
