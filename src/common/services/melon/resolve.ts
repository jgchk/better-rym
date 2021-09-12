import { asArray } from '../../utils/array'
import { stringToDate } from '../../utils/datetime'
import { fetch } from '../../utils/fetch'
import { getReleaseType } from '../../utils/music'
import { isDefined } from '../../utils/types'
import { ResolveFunction } from '../types'

const getTitle = (document_: Document) => {
  // .song_name is misleading, it actually contains the album title
  return document_.querySelector('.song_name')?.childNodes[2]?.nodeValue?.trim()
}

const getArtists = (document_: Document) => {
  return [...document_.querySelectorAll('.section_info .info .artist a')]
    .map((element) => element.textContent?.trim())
    .filter(isDefined)
}

const getDate = (document_: Document) => {
  const dateString =
    document_.querySelectorAll('.section_info .meta dd').item(0)?.textContent ||
    undefined

  return !dateString ? undefined : stringToDate(dateString)
}

const getTracks = (document_: Document) =>
  [...document_.querySelectorAll('.d_song_list tbody > tr')].map((element) => {
    const position = element.querySelector('.rank')?.textContent?.trim()
    const title = element.querySelector('.ellipsis a')?.textContent?.trim()

    return { position, title }
  })

const getType = (document_: Document, numberOfTracks: number) => {
  const type = document_
    .querySelector('.info .gubun')
    ?.textContent?.trim()
    .slice(1, -1)

  switch (type) {
    case '싱글':
      return 'single'
    case 'EP':
      return 'ep'
    case '정규':
      return 'album'
    default:
      return getReleaseType(numberOfTracks)
  }
}

const getCoverArt = (document_: Document) => {
  const url =
    document_.querySelector<HTMLImageElement>('.image_typeAll img')?.src ||
    undefined

  if (!url) return undefined

  // resize the image to a higher res version
  return url
    .replace('_500.jpg', '_1000.jpg')
    .replace('/resize/282/quality/80/optimize', '/quality/80/optimize')
}

export const resolve: ResolveFunction = async (url) => {
  const response = await fetch({ url })
  const document_ = new DOMParser().parseFromString(response, 'text/html')

  const title = getTitle(document_)
  const artists = getArtists(document_)
  const date = getDate(document_)
  const tracks = getTracks(document_)
  const type = getType(document_, tracks.length)
  const coverArt = asArray(getCoverArt(document_))

  return {
    url,
    title,
    artists,
    date,
    tracks,
    type,
    format: 'digital file',
    attributes: ['downloadable', 'streaming'],
    coverArt,
  }
}
