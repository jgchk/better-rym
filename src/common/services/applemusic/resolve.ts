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
import type { MusicVideoData, ReleaseData, TrackLockup } from './codec'

const FULL_IMAGE_SIZE = '999999999x999999999'

function formatMs(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

const getReleaseData = (document_: Document) => {
  // The Apple Music page loads all the tracks information from an SSR
  // hydration payload in
  // `<script type="application/json" id="serialized-server-data">`.
  //
  // This is actually easier to deal with because it's structured and
  // doesn't have to be scapred from the HTML.
  const serverData = document_.querySelector<HTMLScriptElement>(
    'script#serialized-server-data',
  )
  let tracks: TrackLockup[] = [];
  if (serverData) {
    const sections = JSON.parse(serverData.text)[0].data.sections;

    // There will be TrackLockup[] per disc. We can append them all together
    // because each track has the discNumber.
    for (const disc of sections.filter((x: any) => x.itemKind === 'trackLockup')) {
      tracks.push(...disc.items as TrackLockup[]);
    }
  }

  // TODO(elliotchance): This release data is a subset of everything available
  // in serverData above, but it is older and works for most of the general
  // metadata. However, the code can eb refactoted to not need to this at all.
  const releaseScript = document_.querySelector<HTMLScriptElement>(
    'script#schema\\:music-album',
  )
  if (releaseScript) {
    const releaseData = JSON.parse(releaseScript.text) as ReleaseData
    releaseData.tracks = tracks;
    return releaseData;
  }

  const musicVideoScript = document_.querySelector<HTMLScriptElement>(
    'script#schema\\:music-video',
  )
  if (musicVideoScript)
    return JSON.parse(musicVideoScript.text) as MusicVideoData

  throw new Error('Could not get release data for URL ' + document_.URL)
}

function isMulitpleDiscs(tracks: TrackLockup[]): boolean {
  return new Set(tracks.map((t) => t.discNumber)).size > 1;
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
    artists = release.byArtist.map((a) => a.name)

    tracks = release.tracks.map((t, i) => {
      // Apple Music does not make the distinction between albums that are
      // compilations or not. Individual tracks just _might_ have artists,
      // but it's also common for commpilations to exclude the track artist
      // credits if it's the same as the album artist.
      //
      // As a fair balance for this ambiguity, we only include artist credits
      // when they are different from the album artist.
      let title = t.title;
      if (t.artistName && t.artistName !== artists[0]) {
        title = t.artistName + ' - ' + t.title;
      }

      let position = (t.trackNumber || i + 1).toString();
      if (isMulitpleDiscs(release.tracks)) {
        position = t.discNumber.toString() + '.' + position;
      }

      return {
        position,
        title,
        duration: formatMs(t.duration),
      };
    });

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
        document_.querySelector<HTMLMetaElement>('meta[property="og:image"]') ??
          undefined,
        ifDefined((el) =>
          el.content.replace(/\d+x\d+bf-\d+\.jpg/, `${FULL_IMAGE_SIZE}.jpg`),
        ),
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
