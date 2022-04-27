import { asArray } from '../../utils/array'
import { secondsToString, stringToDate } from '../../utils/datetime'
import { fetch } from '../../utils/fetch'
import { getReleaseType } from '../../utils/music'
import { ResolveFunction } from '../types'
import { Release, ReleaseHolder } from './codec'

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
    if (base[1] && base[1][1])
      return (JSON.parse(base[1][1]) as ReleaseHolder)?.d[0]
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
  const tracks = release.relationships.tracks.data.map((element) => {
    const position = element.attributes.trackNumber.toString()
    const title = element.attributes.name
    const duration = secondsToString(element.attributes.durationInMillis / 1000)
    return { position, title, duration }
  })
  const coverArt = asArray(
    release.attributes.artwork.url.replace('{w}x{h}bb.{f}', '2400x2400bb.jpg')
  )
  const label = { name: release.attributes.recordLabel, catno: '' }

  let title = release.attributes.name
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
