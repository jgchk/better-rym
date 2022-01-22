export const streamLinkNames = [
  'youtube',
  'bandcamp',
  'soundcloud',
  'spotify',
  'applemusic',
] as const
export type StreamLinkName = typeof streamLinkNames[number]
const isStreamLinkName = (string: string): string is StreamLinkName =>
  (streamLinkNames as readonly string[]).includes(string)

export const displayTypes = ['available', 'missing'] as const
export type DisplayType = typeof displayTypes[number]

export type State = {
  rows: Row[]
  filters: Filters
  displayType: DisplayType
}

export type Row = {
  parentElement: Element
  mediaLinksElement: Element
  availableMediaLinks: StreamLinkName[]
  missingMediaLinks: StreamLinkName[]
  artistTitle: string
}

export type Filters = {
  links: StreamLinkName[]
  artistTitle: string
}

export const filtersToQueryString = (filters: Filters): string => {
  const queryParameters = new URLSearchParams()
  queryParameters.set('artistTitle', filters.artistTitle)
  for (const link of filters.links) {
    queryParameters.append('link', link)
  }
  return queryParameters.toString()
}

export const queryStringToFilters = (queryString: string): Filters => {
  const queryParameters = new URLSearchParams(queryString)
  const artistTitle = queryParameters.get('artistTitle') ?? ''
  const links = queryParameters.getAll('link').filter(isStreamLinkName)
  return { artistTitle, links }
}
