import { asArray } from '../../utils/array'
import { secondsToString, stringToDate } from '../../utils/datetime'
import { fetch } from '../../utils/fetch'
import { getReleaseType } from '../../utils/music'
import { ReleaseAttribute, ReleaseDate, ResolveFunction, Track } from '../types'
import { ReleaseData } from './codec'

const getData = (document_: Document) => {
  const text = document_.querySelector<HTMLScriptElement>(
    'script[data-tralbum]'
  )?.dataset.tralbum
  return text ? (JSON.parse(text) as ReleaseData) : undefined
}

const getDate = (data: ReleaseData): ReleaseDate | undefined => {
  const dateString = data.current.release_date || data.album_release_date
  return dateString ? stringToDate(dateString) : undefined
}

const getPublishDate = (data: ReleaseData): ReleaseDate | undefined => {
  const dateString = data.current.publish_date
  return dateString ? stringToDate(dateString) : undefined
}

const getTracks = (data: ReleaseData): Track[] | undefined => {
  if (data.item_type === 'track') {
    const trackInfo = data.trackinfo[0]
    if (trackInfo)
      return [
        {
          title: trackInfo.title,
          duration: secondsToString(trackInfo.duration),
        },
      ]
  } else if (data.item_type === 'album') {
    return data.trackinfo.map((track) => ({
      position: track.track_num.toString(),
      title: track.title,
      duration: secondsToString(track.duration),
    }))
  }
}

const getCoverArt = (document_: Document) => {
  return document_
    .querySelector<HTMLAnchorElement>('#tralbumArt a.popupImage')
    ?.href.replace('10.jpg', '0.jpg')
}

export const resolve: ResolveFunction = async (url) => {
  const response = await fetch({ url })
  const document_ = new DOMParser().parseFromString(response, 'text/html')
  const data = getData(document_)

  const url_ = data?.url || url
  const title = data?.current.title
  const artists = asArray(data?.artist)
  const date = data ? getDate(data) : undefined
  const publishDate = data ? getPublishDate(data) : undefined
  const tracks = data ? getTracks(data) : undefined
  const type = tracks ? getReleaseType(tracks.length) : undefined
  const coverArt = asArray(getCoverArt(document_))

  const attributes: ReleaseAttribute[] = ['downloadable', 'streaming']

  const isCreativeCommons = document_
    .getElementById('license')
    ?.textContent?.toLowerCase()
    .includes('some rights reserved')
  if (isCreativeCommons) {
    attributes.push('creative commons')
  }

  return {
    url: url_,
    title,
    artists,
    date,
    publishDate,
    type,
    format: 'lossless digital',
    attributes,
    tracks,
    coverArt,
  }
}
