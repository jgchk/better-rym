import { ResolveFunction } from '..'
import { asArray } from '../../utils/array'
import { stringToDate } from '../../utils/datetime'
import { fetch } from '../../utils/fetch'
import { getReleaseType } from '../../utils/music'
import { isDefined, isUndefined } from '../../utils/types'

const getUrl = (document_: Document) =>
  document_.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href

const getTitle = (document_: Document) =>
  document_.querySelector('.product-name')?.textContent?.trim()

const getArtist = (document_: Document) =>
  document_.querySelector('.product-creator')?.textContent?.trim()

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

const getCoverArt = (document_: Document) => {
  const element = document_.querySelector<HTMLSourceElement>(
    '.product-lockup picture source[type="image/jpeg"]'
  )
  return element?.srcset
    .split(', ')[0]
    ?.split(' ')[0]
    ?.replace(/\d+x\d+/, '2400x2400')
}

export const resolve: ResolveFunction = async (url) => {
  const response = await fetch({ url })
  const document_ = new DOMParser().parseFromString(response, 'text/html')

  const url_ = getUrl(document_) || url
  const title = getTitle(document_)
  const artists = asArray(getArtist(document_))
  const date = getDate(document_)
  const tracks = getTracks(document_)
  const type = getReleaseType(tracks.length)
  const coverArt = getCoverArt(document_)

  return {
    url: url_,
    title,
    artists,
    date,
    type,
    format: 'digital file',
    attributes: ['downloadable', 'streaming'],
    tracks,
    coverArt,
  }
}
