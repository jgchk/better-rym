import { asArray } from '../../utils/array'
import { stringToDate } from '../../utils/datetime'
import { fetch } from '../../utils/fetch'
import { decode } from '../../utils/io-ts'
import { getReleaseType } from '../../utils/music'
import { isDefined } from '../../utils/types'
import { ResolveFunction } from '../types'
import { ReleaseHolder } from './codec'

const getArtists = (document_: Document) =>
  [...document_.querySelectorAll('.product-creator a')]
    .map((element) => element.textContent?.trim())
    .filter(isDefined)

const getTracks = (document_: Document) =>
  [...document_.querySelectorAll('.songs-list-row')].map((element) => {
    const position = element
      .querySelector('.songs-list-row__column-data')
      ?.textContent?.trim()
    const title = element
      .querySelector('.songs-list-row__song-name')
      ?.textContent?.trim()
    const duration = element
      .querySelector('.songs-list-row__length')
      ?.textContent?.trim()
    return { position, title, duration }
  })

const getReleaseData = (document_: Document) => {
  const shoebox = document_
    .querySelector<HTMLScriptElement>('#shoebox-media-api-cache-amp-music')
    ?.text?.replace('\uF8FF', 'apple')
  if (isDefined(shoebox)) {
    const base: [string, string][] = Object.entries(JSON.parse(shoebox))
    if (isDefined(base) && isDefined(base[1]) && isDefined(base[1][1])) {
      return decode(ReleaseHolder)(base[1][1])?.d[0]
    }
  }
  return undefined
}

export const resolve: ResolveFunction = async (url) => {
  const response = await fetch({ url })
  const document_ = new DOMParser().parseFromString(response, 'text/html')
  const release = getReleaseData(document_)

  const url_ = release?.attributes.url || url
  const artists = getArtists(document_)
  const date = stringToDate(release?.attributes.releaseDate || '')
  const tracks = getTracks(document_)
  const coverArt = asArray(
    release?.attributes.artwork.url.replace('{w}x{h}bb.{f}', '2400x2400bb.jpg')
  )
  const label = { name: release?.attributes.recordLabel, catno: '' }

  let title = release?.attributes.name
  let type = getReleaseType(tracks.length)
  if (title?.includes(' - EP')) {
    title = title.replace(' - EP', '')
    type = 'ep'
  } else if (title?.includes(' - Single')) {
    title = title.replace(' - Single', '')
    type = 'single'
  }

  return {
    url: url_,
    title,
    artists,
    date,
    type,
    format: 'lossless digital',
    attributes: ['downloadable', 'streaming'],
    tracks,
    coverArt,
    label,
  }
}
