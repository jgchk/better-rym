import { SEARCHABLES } from '../../../common/services'
import { ServiceId } from '../../../common/services/types'
import {
  runScript,
  waitForDocumentReady,
  waitForElement,
} from '../../../common/utils/dom'

const getTitle = async () => {
  const titleElement = await waitForElement<HTMLMetaElement>(
    'meta[itemprop=name]'
  )
  return titleElement.content
}

const getArtist = async () => {
  const artistElement = await waitForElement<HTMLAnchorElement>('a.artist')
  return artistElement.text
}

/* eslint-disable */
function f(serviceName: any, linkData: any, streamingPreferences: any) {
  let a = null,
    n = null
  for (const r in linkData) {
    const index = linkData[r]
    if (index.default) (a = index), (n = r)
    else if (
      index.for &&
      index.for.includes(streamingPreferences.service_regions[serviceName])
    )
      return (index.media_id = r), index
  }
  return a
    ? a.not && a.not.includes(streamingPreferences.service_regions[serviceName])
      ? null
      : ((a.media_id = n), a)
    : null
}
function m(t: any, linkData: any) {
  switch (t) {
    case 'spotify':
      return `https://open.spotify.com/${linkData.type}/${linkData.media_id}`
    case 'applemusic':
      return `https://geo.music.apple.com/${linkData.loc}/${
        linkData.album ? 'album' : 'video'
      }/${linkData.album ? linkData.album : linkData.video}/${
        linkData.media_id
      }`
    case 'soundcloud':
      return `https://${linkData.url}`
    case 'bandcamp':
      return `https://${linkData.url}`
    case 'youtube':
      return `https://www.youtube.com/watch?v=${linkData.media_id}`
    default:
      throw new Error(`Cannot create links for service: ${t}`)
  }
}
/* eslint-enable */

type StreamingPreferences = Record<string, unknown>
const getStreamingPreferences = (): StreamingPreferences | undefined => {
  let streamingPreferences: StreamingPreferences | undefined = undefined

  const listener = (e: Event) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    streamingPreferences = (e as CustomEvent).detail
      .streamingPreferences as StreamingPreferences
  }
  document.addEventListener('StreamingPreferencesEvent', listener)

  runScript(`
    const streamingPreferences = window.streamingPreferences;
    const __event = new CustomEvent('StreamingPreferencesEvent', { detail: { streamingPreferences } });
    document.dispatchEvent(__event);
  `)

  document.removeEventListener('StreamingPreferencesEvent', listener)

  return streamingPreferences
}

const EMPTY_LINKS = Object.fromEntries(
  SEARCHABLES.map(({ id }) => [id, undefined])
) as Record<ServiceId, string | undefined>

export type Links = Record<ServiceId, string | undefined>
const getLinks = async (): Promise<Links> => {
  await waitForDocumentReady()

  const streamingPreferences = getStreamingPreferences()
  if (!streamingPreferences) return EMPTY_LINKS

  const element_ = document.querySelector<HTMLElement>(
    '#media_link_button_container_top'
  )
  if (!element_) return EMPTY_LINKS

  const linksString = element_.dataset.links
  if (!linksString) return EMPTY_LINKS

  /* eslint-disable */
  const linksData = JSON.parse(linksString)

  const e: { [service: string]: string } = {}
  for (const a in linksData) {
    const n = linksData[a]
    const r = f(a, n, streamingPreferences)
    r && (e[a] = m(a, r))
  }
  /* eslint-enable */

  return Object.fromEntries(SEARCHABLES.map(({ id }) => [id, e[id]])) as Record<
    ServiceId,
    string | undefined
  >
}

export type Metadata = { artist: string; title: string }
export type PageData = { metadata: Metadata; links: Links }
export const getPageData = async (): Promise<PageData> => {
  const [artist, title, links] = await Promise.all([
    getArtist(),
    getTitle(),
    getLinks(),
  ])
  return { metadata: { artist, title }, links }
}
