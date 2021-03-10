import { ReleaseDate, ResolveFunction, Track } from '..'
import { asArray } from '../../utils/array'
import { secondsToString, stringToDate } from '../../utils/datetime'
import { fetch } from '../../utils/fetch'
import { decode } from '../../utils/io-ts'
import { getReleaseType } from '../../utils/music'
import { isDefined, isNotNull } from '../../utils/types'
import { AlbumData, ReleaseData, TrackData } from './codec'

const getData = (document_: Document) => {
  const text = document_.querySelector<HTMLScriptElement>(
    'script[data-tralbum]'
  )?.dataset.tralbum
  return isDefined(text) ? decode(ReleaseData)(text) : undefined
}

const getDate = (data: ReleaseData): ReleaseDate | undefined => {
  const dateString = data.current.release_date || data.album_release_date
  return isNotNull(dateString) ? stringToDate(dateString) : undefined
}

const getTracks = (data: ReleaseData): Track[] | undefined => {
  if (TrackData.is(data)) {
    const trackInfo = data.trackinfo[0]
    if (trackInfo)
      return [
        {
          title: trackInfo.title,
          duration: secondsToString(trackInfo.duration),
        },
      ]
  } else if (AlbumData.is(data)) {
    return data.trackinfo.map((track) => ({
      position: track.track_num.toString(),
      title: track.title,
      duration: secondsToString(track.duration),
    }))
  }
}

const getCoverArt = (document_: Document) => {
  const element = document_.querySelector<HTMLAnchorElement>(
    '#tralbumArt a.popupImage'
  )
  return element?.href.replace('10.jpg', '0')
}

export const resolve: ResolveFunction = async (url) => {
  const response = await fetch({ url })
  const document_ = new DOMParser().parseFromString(response, 'text/html')
  const data = getData(document_)

  const url_ = isDefined(data) ? data.url : url
  const title = data?.current.title
  const artists = asArray(data?.artist)
  const date = isDefined(data) ? getDate(data) : undefined
  const tracks = isDefined(data) ? getTracks(data) : undefined
  const type = isDefined(tracks) ? getReleaseType(tracks.length) : undefined
  const coverArt = asArray(getCoverArt(document_))

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
  }
}
