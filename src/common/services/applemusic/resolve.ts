import { ResolveFunction } from '..'
import { stringToDate } from '../../utils/datetime'
import { fetch } from '../../utils/fetch'
import { getReleaseType } from '../../utils/music'
import { isUndefined } from '../../utils/types'

const getUrl = (document_: Document) =>
  document_.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href

const getTitle = (document_: Document) =>
  document_.querySelector('.product-name')?.textContent?.trim()

const getDate = (document_: Document) => {
  const dateString = document_.querySelector<HTMLMetaElement>(
    'meta[property="music:release_date"]'
  )?.content
  return isUndefined(dateString) ? undefined : stringToDate(dateString)
}

const getTracks = (document_: Document) =>
  [...document_.querySelectorAll('.songs-list .song')].map((element) => {
    const position = element
      .querySelector('.song-index .column-data')
      ?.textContent?.trim()
    const title = element.querySelector('.song-name')?.textContent?.trim()
    const duration = element.querySelector('.time-data')?.textContent?.trim()
    return { position, title, duration }
  })

export const resolve: ResolveFunction = async (url) => {
  const response = await fetch({ url })
  const document_ = new DOMParser().parseFromString(response, 'text/html')

  const url_ = getUrl(document_) || url
  const title = getTitle(document_)
  const date = getDate(document_)
  const tracks = getTracks(document_)
  const type = getReleaseType(tracks.length)

  return {
    url: url_,
    title,
    date,
    type,
    format: 'digital file',
    attributes: ['downloadable', 'streaming'],
    tracks,
  }
}
