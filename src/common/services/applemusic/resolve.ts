import { asArray } from '../../utils/array'
import { secondsToString, stringToDate } from '../../utils/datetime'
import { fetch } from '../../utils/fetch'
import { getReleaseType } from '../../utils/music'
import {
  ReleaseAttribute,
  ReleaseFormat,
  ReleaseLabel,
  ReleaseType,
  ResolveFunction,
  Track,
} from '../types'
import { isVideoRelease, Release, ReleaseHolder } from './codec'

const getArtists = (release: Release) => {
  if (release.relationships.artists.data.length > 0) {
    return release.relationships.artists.data.map(
      (artist) => artist.attributes.name
    )
  }
  return ['Various Artists']
}

const getReleaseData = (document_: Document) => {
  const shoebox = document_
    .querySelector<HTMLScriptElement>('#shoebox-media-api-cache-amp-music')
    ?.text?.replace('\uF8FF', 'apple')
  if (shoebox) {
    const base: [string, string][] = Object.entries(
      JSON.parse(shoebox) as Record<string, string>
    )
    if (base[1] && base[1][1]) {
      const releaseData = (JSON.parse(base[1][1]) as ReleaseHolder)?.d[0]
      if (releaseData) return releaseData
    }
  }
  throw new Error('Could not get release data for URL ' + document_.URL)
}

export const resolve: ResolveFunction = async (url) => {
  const response = await fetch({ url })
  const document_ = new DOMParser().parseFromString(response, 'text/html')
  const release = getReleaseData(document_)

  const url_ = release.attributes.url
  const artists = getArtists(release)
  const date = stringToDate(release.attributes.releaseDate)

  let tracks: Track[] | undefined
  let title: string
  let type: ReleaseType
  let format: ReleaseFormat | undefined
  let attributes: ReleaseAttribute[]
  let label: ReleaseLabel | undefined
  let coverArt: string[] | undefined

  if (isVideoRelease(release)) {
    title = release.attributes.name
    type = 'music video'
    format = undefined
    attributes = []
    coverArt = asArray(
      release.attributes.artwork.url.replace('{w}x{h}mv', '999999999x999999999')
    )
  } else {
    const hasMultipleDiscs = release.relationships.tracks.data.some(
      (track) => track.attributes.discNumber > 1
    )

    // For various artist releases, Apple Music often only shows the artists
    // when it's different from the release artist. For example:
    //
    // 3. Sunflower (Netsky Remix)           | Swae Lee & Post Malone
    // 4. Mixed Emotions (Feat. Montell2099) |
    // 5. Put Your Head on My Shoulder       | Paul Anka & Doja Cat
    //
    // The missing artist on track 4 is because it's the same as the release
    // artist; Netsky in this case.
    //
    // This is kind of wonky when entering into RYM because track 4 should
    // always show as: "Netsky - Mixed Emotions (Feat. Montell2099)"
    //
    // However, we cannot always trust the release artists. Instead, we should
    // decide to always include all artist names or none.
    const hasTrackArtists =
      new Set(
        release.relationships.tracks.data.map(
          (track) => track.attributes.artistName
        )
      ).size > 1

    tracks = release.relationships.tracks.data.map((element) => {
      let position
      const trackNumber = element.attributes.trackNumber
      if (hasMultipleDiscs) {
        const discNumber = element.attributes.discNumber
        position = `${discNumber}.${trackNumber}`
      } else {
        position = trackNumber.toString()
      }

      const title = hasTrackArtists
        ? `${element.attributes.artistName} - ${element.attributes.name}`
        : element.attributes.name

      const duration = secondsToString(
        element.attributes.durationInMillis / 1000
      )
      return { position, title, duration }
    })

    title = release.attributes.name
    type = getReleaseType(tracks.length)
    format = 'lossless digital'
    attributes = ['downloadable', 'streaming']
    if (title?.includes(' - EP')) {
      title = title.replace(' - EP', '')
      type = 'ep'
    } else if (title?.includes(' - Single')) {
      title = title.replace(' - Single', '')
      type = 'single'
    }

    label = { name: release.attributes.recordLabel, catno: '' }
    coverArt = asArray(
      release.attributes.artwork.url.replace(
        '{w}x{h}bb.{f}',
        '999999999x999999999.jpg'
      )
    )
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
