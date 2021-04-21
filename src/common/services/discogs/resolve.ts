import { mergeAndConcat } from 'merge-anything'
import { fetchJson } from '../../../common/utils/fetch'
import { getReleaseType } from '../../utils/music'
import { isNull, isUndefined } from '../../utils/types'
import {
  ReleaseAttribute,
  ReleaseDate,
  ReleaseFormat,
  ResolveData,
  ResolveFunction,
} from '../types'
import { client_key, client_secret } from './auth'
import { Format, FormatDescription, Master, Release } from './codec'
import { regex } from './regex'

type LinkType = 'release' | 'master'
const isValidLinkType = (type: string): type is LinkType =>
  type === 'release' || type === 'master'

const parseDate = (date: string): ReleaseDate => {
  const [year, month, day] = date.split('-')
  return {
    year: year ? Number.parseInt(year) : undefined,
    month: month ? Number.parseInt(month) : undefined,
    day: day ? Number.parseInt(day) : undefined,
  }
}

const parseFormat = (
  format: Format
): [ReleaseFormat | undefined, Partial<ResolveData>] => {
  switch (format.name) {
    case 'Vinyl':
      return ['vinyl', {}]
    case 'Acetate':
      return ['acetate', {}]
    case 'Flexi-disc':
      return ['vinyl', {}]
    case 'Lathe Cut':
      return ['vinyl', {}]
    case 'Shellac':
      return ['shellac', {}]
    case 'Pathé Disc':
      return ['vinyl', {}]
    case 'Edison Disc':
      return ['vinyl', {}]
    case 'Cylinder':
      return ['phonograph cylinder', {}]
    case 'CD':
      return ['cd', {}]
    case 'CDr':
      return ['cd-r', {}]
    case 'CDV':
      return ['laserdisc', {}]
    case 'DVD':
      return ['dvd', {}]
    case 'DVDr':
      return ['dvd-r', {}]
    case 'HD DVD':
      return ['dvd', {}]
    case 'HD DVD-R':
      return ['dvd-r', {}]
    case 'Blu-ray':
      return ['blu-ray', {}]
    case 'Blu-ray-R':
      return ['blu-ray', {}]
    case 'SACD':
      return ['sacd', {}]
    case '4-Track Cartridge':
      return ['4 track', {}]
    case '8-Track Cartridge':
      return ['8 track', {}]
    case 'Cassette':
      return ['cassette', {}]
    case 'DC-International':
      return ['cassette', {}]
    case 'Elcaset':
      return ['cassette', {}]
    case 'PlayTape':
      return ['playtape', {}]
    case 'RCA Tape Cartridge':
      return ['cassette', {}]
    case 'DAT':
      return ['dat', {}]
    case 'DCC':
      return ['dcc', {}]
    case 'Microcassette':
      return ['microcasette', {}]
    case 'NT Cassette':
      return ['microcasette', {}]
    case 'Pocket Rocker':
      return ['cassette', {}]
    case 'Revere Magnetic Stereo Tape Ca':
      return ['cassette', {}]
    case 'Tefifon':
      return ['cassette', {}]
    case 'Reel-To-Reel':
      return ['reel-to-reel', {}]
    case 'Sabamobil':
      return ['cassette', {}]
    case 'Betacam':
      return ['beta', {}]
    case 'Betacam SP':
      return ['beta', {}]
    case 'Betamax':
      return ['beta', {}]
    case 'Cartrivision':
      return ['vhs', {}]
    case 'MiniDV':
      return ['vhs', {}]
    case 'U-matic':
      return ['vhs', {}]
    case 'VHS':
      return ['vhs', {}]
    case 'Video 2000':
      return ['vhs', {}]
    case 'Video8':
      return ['vhs', {}]
    case 'Film Reel':
      return ['reel-to-reel', {}]
    case 'Laserdisc':
      return ['laserdisc', {}]
    case 'SelectaVision':
      return ['laserdisc', {}]
    case 'VHD':
      return ['laserdisc', {}]
    case 'Wire Recording':
      return [undefined, {}]
    case 'Minidisc':
      return ['minidisc', {}]
    case 'MVD':
      return ['minidisc', {}]
    case 'UMD':
      return ['minidisc', {}]
    case 'Floppy Disk':
      return ['digital file', {}]
    case 'File':
      return ['digital file', { attributes: ['downloadable'] }]
    case 'Memory Stick':
      return ['digital file', { attributes: ['usb/flash drive'] }]
    case 'Hybrid':
      return [undefined, {}]
    case 'All Media':
      return [undefined, {}]
    case 'Box Set':
      return [undefined, { attributes: ['box set'] }]
  }
}

const parseAttribute = (
  desc: FormatDescription
): [ReleaseAttribute | undefined, Partial<ResolveData>] => {
  switch (desc) {
    case 'LP':
      return [undefined, { type: 'album' }]
    case '16"':
      return [undefined, { discSize: '16' }]
    case '12"':
      return [undefined, { discSize: '12' }]
    case '11"':
      return [undefined, { discSize: '11' }]
    case '10"':
      return [undefined, { discSize: '10' }]
    case '9"':
      return [undefined, { discSize: '9' }]
    case '8"':
      return [undefined, { discSize: '8' }]
    case '7"':
      return [undefined, { discSize: '7' }]
    case '6"':
      return [undefined, { discSize: '6' }]
    case '4"':
      return [undefined, { discSize: '4' }]
    case '3"':
      return [undefined, { discSize: '3' }]
    case '6½"':
    case '5½"':
    case '3½"':
    case '2"':
    case '1"':
      return [undefined, { discSize: 'non-standard' }]
    case '16 ⅔ RPM':
      return ['16 rpm', {}]
    case '33 ⅓ RPM':
      return ['33 rpm', {}]
    case '45 RPM':
      return ['45 rpm', {}]
    case '78 RPM':
      return ['78 rpm', {}]
    case '80 RPM':
      return ['80 rpm', {}]
    case 'Single Sided':
      return ['single-sided', {}]
    case 'Album':
      return [undefined, { type: 'album' }]
    case 'Mini-Album':
      return [undefined, { type: 'album' }]
    case 'EP':
      return [undefined, { type: 'ep' }]
    case 'Maxi-Single':
      return [undefined, { type: 'single' }]
    case 'Single':
      return [undefined, { type: 'single' }]
    case 'Compilation':
      return [undefined, { type: 'compilation' }]
    case 'Club Edition':
      return ['fan club release', {}]
    case 'Deluxe Edition':
      return ['deluxe edition', {}]
    case 'Enhanced':
      return ['enhanced cd', {}]
    case 'Etched':
      return ['etched', {}]
    case 'Limited Edition':
      return ['limited edition', {}]
    case 'Mixtape':
      return [undefined, { type: 'mixtape' }]
    case 'Numbered':
      return ['numbered edition', {}]
    case 'Picture Disc':
      return ['picture disc', {}]
    case 'Promo':
      return ['promo', {}]
    case 'Remastered':
      return ['remastered', {}]
    case 'Test Pressing':
      return ['test pressing', {}]
    case 'Unofficial Release':
      return [undefined, { type: 'bootleg' }]
    case 'White Label':
      return ['white label', {}]
    case 'Mono':
      return ['mono', {}]
    case 'Quadraphonic':
      return ['quadraphonic', {}]
    case 'HDCD':
      return [undefined, { format: 'hdcd' }]
    case 'VCD':
      return [undefined, { format: 'vcd' }]
    case 'AVCD':
      return [undefined, { format: 'vcd' }]
    case 'SVCD':
      return [undefined, { format: 'vcd' }]
    case 'DVD-Audio':
      return [undefined, { format: 'dvd-a' }]
    case '3 ¾ ips':
      return ['3 3/4 ips', {}]
    case '7 ½ ips':
      return ['7 1/2 ips', {}]
    case '2-Track Mono':
      return ['mono', {}]
    case '4-Track Mono':
      return ['mono', {}]
    case 'AIFC':
    case 'AIFF':
    case 'ALAC':
    case 'APE':
    case 'DFF':
    case 'DSF':
    case 'FLAC':
    case 'SHN':
    case 'TTA':
    case 'WAV':
    case 'WavPack':
    case 'WMA':
      return [undefined, { format: 'lossless digital' }]
    case 'DualDisc':
      return [undefined, { format: 'dualdisc' }]
    default:
      return [undefined, {}]
  }
}

const parseAttributes = (
  format: Format
): readonly [ReleaseAttribute[], Partial<ResolveData>] => {
  return format.descriptions.reduce<[ReleaseAttribute[], Partial<ResolveData>]>(
    ([attributes, resolveData], desc) => {
      const [descAttribute, descResolveData] = parseAttribute(desc)
      const descAttributeArray: ReleaseAttribute[] = descAttribute
        ? [descAttribute]
        : []
      const combinedAttributes: ReleaseAttribute[] = [
        ...attributes,
        ...descAttributeArray,
      ]
      return [combinedAttributes, mergeAndConcat(resolveData, descResolveData)]
    },
    [[], {}]
  )
}

const resolveRelease = async (id: string): Promise<ResolveData> => {
  const response = await fetchJson(
    {
      url: `https://api.discogs.com/releases/${id}`,
      urlParameters: {
        key: client_key,
        secret: client_secret,
      },
    },
    Release
  )

  const url = response.uri
  const title = response.title
  const artists = response.artists.map((artist) => artist.name)
  const date = parseDate(response.released)
  const tracks = response.tracklist.map((track) => ({
    position: track.position.replace('-', '.').replace(/(CD|DVD)\D?/, ''), // CD1-1 -> 1.1
    title: track.title,
    duration: track.duration,
  }))
  const type = getReleaseType(tracks.length)
  const coverArt = response.images.map((image) => image.resource_url)

  let format: ReleaseFormat | undefined,
    attributes: ReleaseAttribute[],
    partialResolveData: Partial<ResolveData>
  if (response.formats[0]) {
    const formatResult = parseFormat(response.formats[0])
    format = formatResult[0]

    const attributesResult = parseAttributes(response.formats[0])
    attributes = attributesResult[0]

    partialResolveData = mergeAndConcat(formatResult[1], attributesResult[1])
  } else {
    format = undefined
    attributes = []
    partialResolveData = {}
  }

  const resolveData = mergeAndConcat(
    {
      url,
      title,
      artists,
      date,
      type,
      format,
      attributes,
      tracks,
      coverArt,
    },
    partialResolveData
  )
  // de-dupe attributes
  resolveData.attributes = [...new Set(resolveData.attributes)]
  return resolveData
}

const getMasterPrimaryReleaseId = async (masterId: string) => {
  const response = await fetchJson(
    {
      url: `https://api.discogs.com/masters/${masterId}`,
      urlParameters: {
        key: client_key,
        secret: client_secret,
      },
    },
    Master
  )
  return response.main_release
}

export const resolve: ResolveFunction = async (url) => {
  const match = regex.exec(url)
  if (isNull(match)) throw new Error('Invalid Discogs URL')

  const type = match[5]
  if (isUndefined(type) || !isValidLinkType(type))
    throw new Error(
      `Expected link to be release/master. Received: ${String(type)}`
    )

  const id = match[6]
  if (isUndefined(id)) throw new Error('Could not find ID in link')

  const releaseId =
    type === 'release' ? id : (await getMasterPrimaryReleaseId(id)).toString()
  return resolveRelease(releaseId)
}
