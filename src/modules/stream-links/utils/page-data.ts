import { SEARCHABLES } from '../../../common/services'
import { ServiceId } from '../../../common/services/types'
import { waitForCallback, waitForElement } from '../../../common/utils/dom'

declare global {
  interface Window {
    streamingPreferences: {
      service_regions: { [service: string]: string }
    }
  }
}

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
function f(serviceName: any, linkData: any) {
  let a = null,
    n = null
  for (const r in linkData) {
    const index = linkData[r]
    if (index.default) (a = index), (n = r)
    else if (
      index.for &&
      index.for.includes(
        window.streamingPreferences.service_regions[serviceName]
      )
    )
      return (index.media_id = r), index
  }
  return a
    ? a.not &&
      a.not.includes(window.streamingPreferences.service_regions[serviceName])
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

export type Links = Record<ServiceId, string | undefined>
const getLinks = async (): Promise<Links> =>
  waitForCallback(() => {
    const element_ = document.querySelector<HTMLElement>(
      '#media_link_button_container_top'
    )
    if (!element_) return

    const linksString = element_.dataset.links
    if (!linksString) return

    /* eslint-disable */
    const linksData = JSON.parse(linksString)
    console.log(linksData)

    const e: { [service: string]: string } = {}
    for (const a in linksData) {
      const n = linksData[a]
      const r = f(a, n)
      r && (e[a] = m(a, r))
    }
    console.log('aaaa', e)
    /* eslint-enable */

    return Object.fromEntries(
      SEARCHABLES.map(({ id }) => [id, e[id]])
    ) as Record<ServiceId, string | undefined>
  })

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
