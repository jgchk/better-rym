import { SEARCHABLES } from '../../common/services'
import { ServiceId } from '../../common/services/types'
import {
  isDocumentReady,
  waitForCallback,
  waitForElement,
} from '../../common/utils/dom'
import { isNotNull, isNull } from '../../common/utils/types'

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

export type Links = Record<ServiceId, string | undefined>
const getLinks = async (): Promise<Links> =>
  waitForCallback(() => {
    const element = document.querySelector(
      '.release_left_column .hide-for-small'
    )
    if (isNull(element)) return

    const complete =
      isNotNull(element.querySelector('a[href^="/submit_media_link"]')) ||
      isDocumentReady()
    if (!complete) return

    const getLink = (service: ServiceId) => {
      const linkElement = element.querySelector<HTMLAnchorElement>(
        `a.ui_media_link_btn_${service}`
      )
      return linkElement?.href
    }

    const links = Object.fromEntries(
      SEARCHABLES.map(({ id }) => [id, getLink(id)])
    ) as Record<ServiceId, string | undefined>
    return links
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
