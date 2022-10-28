import { asArray } from '../../utils/array'
import { stringToDate } from '../../utils/datetime'
import { fetch } from '../../utils/fetch'
import { getReleaseType } from '../../utils/music'
import { pipe } from '../../utils/pipe'
import { ifDefined } from '../../utils/types'
import {
  ReleaseAttribute,
  ReleaseFormat,
  ReleaseLabel,
  ReleaseType,
  ResolveFunction,
  Track,
} from '../types'
import { MusicVideoData, ReleaseData } from './codec'

const getReleaseData = (document_: Document) => {
  const releaseScript = document_.querySelector<HTMLScriptElement>(
    'script#schema\\:music-album'
  )
  if (releaseScript) return JSON.parse(releaseScript.text) as ReleaseData

  const musicVideoScript = document_.querySelector<HTMLScriptElement>(
    'script#schema\\:music-video'
  )
  if (musicVideoScript)
    return JSON.parse(musicVideoScript.text) as MusicVideoData

  throw new Error('Could not get release data for URL ' + document_.URL)
}

export const resolve: ResolveFunction = async (url) => {
  const response = await fetch({ url })
  const document_ = new DOMParser().parseFromString(response, 'text/html')
  const release = getReleaseData(document_)

  const url_ = release.url
  let artists: string[]
  const date = stringToDate(
    release['@type'] === 'MusicAlbum'
      ? release.datePublished
      : release.dateCreated
  )

  let tracks: Track[] | undefined
  let title: string
  let type: ReleaseType
  let format: ReleaseFormat | undefined
  let attributes: ReleaseAttribute[]
  let label: ReleaseLabel | undefined
  let coverArt: string[] | undefined

  if (release['@type'] === 'MusicVideoObject') {
    artists = release.creator.map((c) => c.name)
    title = release.name
    type = 'music video'
    format = undefined
    attributes = []
    coverArt = asArray(
      release.image.replace('{w}x{h}mv', '999999999x999999999')
    )
  } else {
    tracks = []
    const tracklists = [
      ...document_.querySelectorAll<HTMLElement>('.songs-list'),
    ]
    for (const tracklist of tracklists) {
      const discNum = pipe(
        tracklist.parentElement
          ?.querySelector('.header .title')
          ?.textContent?.slice(5),
        ifDefined((n) => Number.parseInt(n)),
        ifDefined((n) => (Number.isNaN(n) ? undefined : n))
      )
      const trackEls = [...tracklist.querySelectorAll('.songs-list-row')]
      for (const trackEl of trackEls) {
        const trackNum = pipe(
          trackEl
            .querySelector('[data-testid="track-number"]')
            ?.textContent?.trim() ?? undefined,
          ifDefined((n) => Number.parseInt(n)),
          ifDefined((n) => (Number.isNaN(n) ? undefined : n))
        )
        const trackTitle =
          trackEl
            .querySelector('[data-testid="track-title"]')
            ?.textContent?.trim() ?? undefined
        const duration =
          trackEl
            .querySelector('[data-testid="track-duration"]')
            ?.textContent?.trim() ?? undefined
        const trackArtists =
          trackEl
            .querySelector('.songs-list-row__by-line')
            ?.textContent?.replaceAll('\n', '')
            .replace(/\s+/g, ' ')
            .trim() ?? undefined

        let position: string | undefined
        if (trackNum !== undefined) {
          position =
            discNum !== undefined
              ? `${discNum}.${trackNum}`
              : trackNum.toString()
        }

        let title: string | undefined
        if (trackTitle) {
          title = trackArtists ? `${trackArtists} - ${trackTitle}` : trackTitle
        }

        tracks.push({ position, title, duration })
      }
    }

    artists = [release.byArtist.name]
    title = release.name
    type = getReleaseType(release.tracks.length)
    format = 'digital file'
    attributes = ['streaming']
    if (title?.includes(' - EP')) {
      title = title.replace(' - EP', '')
      type = 'ep'
    } else if (title?.includes(' - Single')) {
      title = title.replace(' - Single', '')
      type = 'single'
    }

    const descEl = document_.querySelector(
      '[data-testid="tracklist-footer-description"]'
    )
    if (descEl) {
      const descText = descEl.textContent ?? ''
      const lines = descText.split('\n')
      if (lines.length === 3) {
        const labelLine = lines[2]
          ?.replace('℗', '')
          .replaceAll(/20\d\d/g, '')
          .replaceAll(/19\d\d/g, '')
          .replace('This Compilation', '')
          .trim()

        if (lines[2]?.includes('This Compilation')) {
          type = 'compilation'
        }

        if (labelLine) {
          label = { name: labelLine, catno: '' }
        }
      }
    }

    coverArt = asArray(
      pipe(
        document_.querySelector<HTMLMetaElement>('meta[property="og:image"]') ??
          undefined,
        ifDefined((el) =>
          el.content.replace(/\d+x\d+bf-\d+\.jpg/, '999999999x999999999.jpg')
        )
      )
    )

    const isDownloadable =
      document.querySelector(
        'button[aria-label="Also available in the iTunes Store"]'
      ) !== null
    if (isDownloadable) {
      format = 'lossless digital'
      attributes.push('downloadable')
    }
  }

  return {
    url: url_,
    title,
    artists,
    date,
    type,
    format,
    attributes,
    tracks,
    coverArt,
    label,
  }
}
