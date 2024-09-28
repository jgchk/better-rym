import { useEffect, useState } from 'preact/hooks'

import {
  complete,
  failed,
  initial,
  isInitial,
  loading,
  OneShot,
} from '../../common/utils/one-shot'
import {
  runScript,
  waitForDocumentReady,
  waitForElement,
} from '~/common/utils/dom'
import { SEARCHABLES } from '~/common/services'
import { ServiceId } from '~/common/services/types'

export type PageDataState = OneShot<Error, PageData>

export const usePageData = (): PageDataState => {
  const [state, setState] = useState<PageDataState>(initial)

  const fetch = async () => {
    setState(loading)

    const nextState = await getPageData()
      .then((data) => complete(data))
      .catch((error) => failed(error))

    setState(nextState)
  }

  useEffect(() => {
    if (isInitial(state)) {
      void fetch()
    }
  }, [state])

  return state
}

type PageData = {
  metadata: { artist: string; title: string }
  links: Links
}
async function getPageData(): Promise<PageData> {
  const [artist, title, links] = await Promise.all([
    getArtist(),
    getTitle(),
    getLinks(),
  ])
  return { metadata: { artist, title }, links }
}

async function getArtist() {
  const artistElement = await waitForElement<HTMLAnchorElement>('a.artist')
  return artistElement.text
}

async function getTitle() {
  const titleElement = await waitForElement<HTMLMetaElement>(
    'meta[itemprop=name]',
  )
  return titleElement.content
}

async function getLinks(): Promise<Links> {
  await waitForDocumentReady()

  const streamingPreferences = await getStreamingPreferences()
  if (!streamingPreferences) return EMPTY_LINKS

  const element_ = document.querySelector<HTMLElement>(
    '#media_link_button_container_top',
  )
  if (!element_) return EMPTY_LINKS

  const linksString = element_.dataset.links
  if (!linksString) return EMPTY_LINKS

  const linksData = JSON.parse(linksString)

  const e: { [service: string]: string } = {}
  for (const service in linksData) {
    const linkData = linksData[service]
    const r = f(service, linkData, streamingPreferences)
    if (r) {
      e[service] = getFullLink(service, r)
    }
  }

  return Object.fromEntries(SEARCHABLES.map(({ id }) => [id, e[id]])) as Record<
    ServiceId,
    string | undefined
  >
}

type Links = Record<ServiceId, string | undefined>

const EMPTY_LINKS = Object.fromEntries(
  SEARCHABLES.map(({ id }) => [id, undefined]),
) as Record<ServiceId, string | undefined>

const getStreamingPreferences = async (): Promise<
  StreamingPreferences | undefined
> => {
  return new Promise((resolve) => {
    const listener = (e: Event) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const streamingPreferences = (e as CustomEvent).detail
        .streamingPreferences as StreamingPreferences

      document.removeEventListener('StreamingPreferencesEvent', listener)

      resolve(streamingPreferences)
    }
    document.addEventListener('StreamingPreferencesEvent', listener)

    void runScript(`
      const streamingPreferences = window.streamingPreferences;
      const __event = new CustomEvent('StreamingPreferencesEvent', { detail: { streamingPreferences } });
      document.dispatchEvent(__event);
    `)
  })
}

type StreamingPreferences = { service_regions: Record<string, unknown> }

function f(
  service: string,
  linkData: any,
  streamingPreferences: StreamingPreferences,
) {
  let a = null
  let n = null

  for (const r in linkData) {
    const index = linkData[r]
    if (index.default) (a = index), (n = r)
    else if (
      index.for &&
      index.for.includes(streamingPreferences.service_regions[service])
    )
      return (index.media_id = r), index
  }

  return a
    ? a.not && a.not.includes(streamingPreferences.service_regions[service])
      ? null
      : ((a.media_id = n), a)
    : null
}

function getFullLink(service: string, linkData: any) {
  switch (service) {
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
      throw new Error(`Cannot create links for service: ${service}`)
  }
}
