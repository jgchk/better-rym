import { stringToDate } from '../../utils/datetime'
import { fetch } from '../../utils/fetch'
import { getReleaseType } from '../../utils/music'
import { isDefined } from '../../utils/types'
import type { ReleaseLabel, ResolveFunction } from '../types'

const getTitle = (document_: Document) => {
  return document_
    .querySelector('.interior-release-chart-content h1')
    ?.textContent?.trim()
}

const getArtists = (document_: Document) => {
  return [
    ...document_.querySelectorAll(
      '.interior-release-chart-content .interior-release-chart-content-item a[data-artist]',
    ),
  ]
    .map((element) => element.textContent?.trim())
    .filter(isDefined)
}

const getDate = (document_: Document) => {
  const dateString = document_
    .querySelector(
      '.interior-release-chart-artwork-parent .interior-release-chart-content-item:nth-child(1) .value',
    )
    ?.textContent?.trim()

  return !dateString ? undefined : stringToDate(dateString)
}

const getTracks = (document_: Document) =>
  [...document_.querySelectorAll('.track')].map((element) => {
    const position = element
      .querySelector('.track .buk-track-num')
      ?.textContent?.trim()

    const primaryTitle = element
      .querySelector('.buk-track-primary-title')
      ?.textContent?.trim()

    const remix = element
      .querySelector('.buk-track-remixed')
      ?.textContent?.trim()

    let title = primaryTitle
    if (remix && remix.toLowerCase() !== 'original mix') {
      title += ` (${remix})`
    }

    let duration = element
      .querySelector('.buk-track-length')
      ?.textContent?.trim()

    if (duration) {
      const durationParts = duration.split(':')
      if (durationParts.length === 3) {
        const hours = Number.parseInt(durationParts[0] ?? '0')
        const minutes = Number.parseInt(durationParts[1] ?? '0')
        const seconds = durationParts[2] ?? '00'

        const totalMinutes = hours * 60 + minutes
        duration = `${totalMinutes}:${seconds}`
      }
    }

    return { position, title, duration }
  })

const getCoverArt = (document_: Document) => {
  const originalUrl = document_.querySelector<HTMLImageElement>(
    'img.interior-release-chart-artwork',
  )?.src

  const maxSizeUrl = originalUrl?.replace(/\/\d+x\d+\//, '/0x0/')

  return [maxSizeUrl, originalUrl].filter(isDefined)
}

const getLabel = (document_: Document): ReleaseLabel => {
  const name = document_
    .querySelector(
      '.interior-release-chart-artwork-parent .interior-release-chart-content-item:nth-child(2) .value',
    )
    ?.textContent?.trim()

  const catno = document_
    .querySelector(
      '.interior-release-chart-artwork-parent .interior-release-chart-content-item:nth-child(3) .value',
    )
    ?.textContent?.trim()

  return { name, catno }
}

export const resolve: ResolveFunction = async (url) => {
  const response = await fetch({ url })
  const document_ = new DOMParser().parseFromString(response, 'text/html')

  const title = getTitle(document_)
  const artists = getArtists(document_)
  const date = getDate(document_)
  const tracks = getTracks(document_)
  const type = getReleaseType(tracks.length)
  const coverArt = getCoverArt(document_)
  const label = getLabel(document_)

  return {
    url,
    title,
    artists,
    date,
    tracks,
    type,
    format: 'lossless digital',
    attributes: ['downloadable', 'streaming'],
    label,
    coverArt,
  }
}
