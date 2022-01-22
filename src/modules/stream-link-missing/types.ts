export const streamLinkNames = [
  'youtube',
  'bandcamp',
  'soundcloud',
  'spotify',
  'applemusic',
] as const
export type StreamLinkName = typeof streamLinkNames[number]

export const displayTypes = ['available', 'missing'] as const
export type DisplayType = typeof displayTypes[number]

export type State = {
  rows: Row[]
  filters: Filters
}

export type Row = {
  parentElement: Element
  mediaLinksElement: Element
  availableMediaLinks: StreamLinkName[]
  missingMediaLinks: StreamLinkName[]
  artistTitle: string
}

export type Filters = {
  displayType: DisplayType
  links: StreamLinkName[]
  artistTitle: string
}
