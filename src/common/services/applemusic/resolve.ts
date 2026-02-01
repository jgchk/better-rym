import { asArray } from '../../utils/array'
import { stringToDate } from '../../utils/datetime'
import { fetch } from '../../utils/fetch'
import { getReleaseType } from '../../utils/music'
import { pipe } from '../../utils/pipe'
import { ifDefined } from '../../utils/types'
import type {
  ReleaseAttribute,
  ReleaseFormat,
  ReleaseLabel,
  ReleaseType,
  ResolveFunction,
  Track,
} from '../types'
import type { MusicVideoData, ReleaseData } from './codec'

const FULL_IMAGE_SIZE = '999999999x999999999'

export function convertAppleMusicDuration(appleMusicDuration: string) {
  // Extract minutes and seconds using a regular expression
  const matches = /PT(?:(\d+?)M)?(?:(\d+?)S)?/.exec(appleMusicDuration)

  if (!matches) {
    throw new Error(`Invalid format: ${appleMusicDuration}`)
  }

  // If minutes are not defined, set it to '0'
  const mins = matches[1] || '0'
  // If seconds are not defined, set it to '00'
  const secs = matches[2] || '00'

  // Pad the seconds with a leading 0 if it's a single digit
  const minutes = mins
  const seconds = secs.length === 1 ? '0' + secs : secs

  // Construct the final duration string
  const duration = `${minutes}:${seconds}`

  return duration
}

const getReleaseData = (document_: Document) => {
  const releaseScript = document_.querySelector<HTMLScriptElement>(
    'script#schema\\:music-album',
  )
  if (releaseScript) return JSON.parse(releaseScript.text) as ReleaseData

  const musicVideoScript = document_.querySelector<HTMLScriptElement>(
    'script#schema\\:music-video',
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
      : release.dateCreated,
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
    coverArt = [
      release.video.thumbnailUrl,
      release.image.replace('{w}x{h}mv', FULL_IMAGE_SIZE),
    ]
  } else {
    tracks = release.tracks.map((t, i) => ({
      position: String(i + 1),
      title: t.name,
      duration: ifDefined(convertAppleMusicDuration)(t.duration),
    }))

    artists = release.byArtist.map((a) => a.name)
    title = release.name
    type = getReleaseType(release.tracks.length)
    format = 'lossless digital'
    attributes = ['streaming']
    if (title?.includes(' - EP')) {
      title = title.replace(' - EP', '')
      type = 'ep'
    } else if (title?.includes(' - Single')) {
      title = title.replace(' - Single', '')
      type = 'single'
    }

    const descEl = document_.querySelector(
      '[data-testid="tracklist-footer-description"]',
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
        document_.querySelector<HTMLSourceElement>(
          'div[slot="artwork"] source[type="image/jpeg"]',
        ),
        ifDefined((el) => {
          // get the last (largest?) srcset entry, take URL before whitespace
          const srcset = el?.attributes?.srcset?.value
          if (!srcset) return undefined
          const lastSrc = srcset.split(',').pop()?.trim()
          return lastSrc ? lastSrc.split(' ')[0] : undefined
        }),
      ),
    )

    const isDownloadable =
      document_.querySelector('button[aria-label$="iTunes Store"]') !== null ||
      // yes, these are different selectors lmao
      document_.querySelector('button[aria-label$="iTunes Store"]') !== null
    if (isDownloadable) {
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
