import { useEffect, useState } from 'preact/hooks'

import { SEARCHABLES } from '~/common/services'
import type { ServiceId } from '~/common/services/types'
import {
  runScript,
  waitForDocumentReady,
  waitForElement,
} from '~/common/utils/dom'

import type { OneShot } from '../../common/utils/one-shot'
import {
  complete,
  failed,
  initial,
  isInitial,
  loading,
} from '../../common/utils/one-shot'

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

  const linksData = JSON.parse(linksString) as PageLinksData

  const links = Object.fromEntries(
    Object.entries(linksData).map(([service, linkData]) => {
      const r = getLinkData(service, linkData, streamingPreferences)
      if (r) {
        const link = getFullLink(service, r)
        return [service, link]
      }

      return [service, undefined]
    }),
  )

  return Object.fromEntries(
    SEARCHABLES.map(({ id }) => [id, links[id]]),
  ) as Record<ServiceId, string | undefined>
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
      const streamingPreferences =
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (e as CustomEvent).detail.streamingPreferences as StreamingPreferences

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

type PageLinksData = Record<
  string,
  Record<
    string,
    LinkData & {
      default?: true
      for?: string[]
      not?: string[]
      media_id: string
    }
  >
>

type StreamingPreferences = { service_regions: Record<string, string> }

function getLinkData(
  service: string,
  linkData: PageLinksData[string],
  streamingPreferences: StreamingPreferences,
): LinkData | null {
  let bestLinkData = null
  let bestMediaId = null

  for (const [mediaId, index] of Object.entries(linkData)) {
    if ('default' in index && index.default) {
      bestLinkData = index
      bestMediaId = mediaId
    } else if (
      index.for?.includes(streamingPreferences.service_regions[service])
    ) {
      index.media_id = mediaId
      return index
    }
  }

  if (bestLinkData) {
    if (
      bestLinkData.not?.includes(streamingPreferences.service_regions[service])
    ) {
      return null
    }

    if (bestMediaId !== null) {
      bestLinkData.media_id = bestMediaId
    }

    return bestLinkData
  }

  return null
}

function getFullLink(service: string, linkData: LinkData) {
  switch (service) {
    case 'spotify': {
      const data = linkData as SpotifyLinkData
      return `https://open.spotify.com/${data.type}/${data.media_id}`
    }

    case 'applemusic': {
      const data = linkData as AppleMusicLinkData
      return `https://geo.music.apple.com/${data.loc}/${
        data.album ? 'album' : 'video'
      }/${data.album ? data.album : data.video}/${data.media_id}`
    }

    case 'soundcloud': {
      const data = linkData as SoundcloudLinkData
      return `https://${data.url}`
    }

    case 'bandcamp': {
      const data = linkData as BandcampLinkData
      return `https://${data.url}`
    }

    case 'youtube': {
      const data = linkData as YoutubeLinkData
      return `https://www.youtube.com/watch?v=${data.media_id}`
    }

    default:
      throw new Error(`Cannot create links for service: ${service}`)
  }
}

type LinkData =
  | SpotifyLinkData
  | AppleMusicLinkData
  | SoundcloudLinkData
  | BandcampLinkData
  | YoutubeLinkData

type SpotifyLinkData = { type: string; media_id: string }
type AppleMusicLinkData = {
  album?: string
  video?: string
  loc: string
  media_id: string
}
type SoundcloudLinkData = { url: string }
type BandcampLinkData = { url: string }
type YoutubeLinkData = { media_id: string }
