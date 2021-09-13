import { mergeAndConcat } from 'merge-anything'
import { fetch } from '../../../common/utils/fetch'
import { getReleaseType } from '../../utils/music'
import {
  DiscSize,
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
    case 'Flexi-disc':
    case 'Lathe Cut':
    case 'Pathé Disc':
    case 'Edison Disc':
      return ['vinyl', {}]
    case 'Acetate':
      return ['acetate', {}]
    case 'Shellac':
      return ['shellac', {}]
    case 'Cylinder':
      return ['phonograph cylinder', {}]
    case 'CD':
      return ['cd', {}]
    case 'CDr':
      return ['cd-r', {}]
    case 'DVD':
    case 'HD DVD':
      return ['dvd', {}]
    case 'DVDr':
    case 'HD DVD-R':
      return ['dvd-r', {}]
    case 'Blu-ray':
    case 'Blu-ray-R':
      return ['blu-ray', {}]
    case 'SACD':
      return ['sacd', {}]
    case '4-Track Cartridge':
      return ['4 track', {}]
    case '8-Track Cartridge':
      return ['8 track', {}]
    case 'Cassette':
    case 'DC-International':
    case 'Elcaset':
    case 'RCA Tape Cartridge':
    case 'Pocket Rocker':
    case 'Revere Magnetic Stereo Tape Ca':
    case 'Tefifon':
    case 'Sabamobil':
      return ['cassette', {}]
    case 'Microcassette':
    case 'NT Cassette':
      return ['microcasette', {}]
    case 'PlayTape':
      return ['playtape', {}]
    case 'DAT':
      return ['dat', {}]
    case 'DCC':
      return ['dcc', {}]
    case 'Betacam':
    case 'Betacam SP':
    case 'Betamax':
      return ['beta', {}]
    case 'Cartrivision':
    case 'MiniDV':
    case 'U-matic':
    case 'VHS':
    case 'Video 2000':
    case 'Video8':
      return ['vhs', {}]
    case 'Reel-To-Reel':
    case 'Film Reel':
      return ['reel-to-reel', {}]
    case 'CDV':
    case 'Laserdisc':
    case 'SelectaVision':
    case 'VHD':
      return ['laserdisc', {}]
    case 'Minidisc':
    case 'MVD':
    case 'UMD':
      return ['minidisc', {}]
    case 'Floppy Disk':
      return ['digital file', {}]
    case 'File':
      return ['digital file', { attributes: ['downloadable'] }]
    case 'Memory Stick':
      return ['digital file', { attributes: ['usb/flash drive'] }]
    case 'Wire Recording':
    case 'Hybrid':
    case 'All Media':
      return [undefined, {}]
    case 'Box Set':
      return [undefined, { attributes: ['box set'] }]
  }
}

const parseAttribute = (
  desc: FormatDescription | string
): [ReleaseAttribute | undefined, Partial<ResolveData>] => {
  switch (desc) {
    case '16"':
    case '12"':
    case '11"':
    case '10"':
    case '9"':
    case '8"':
    case '7"':
    case '6"':
    case '4"':
    case '3"':
      return [undefined, { discSize: desc.slice(0, -1) as DiscSize }]
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
    case 'Advance':
      return ['promo', {}]
    case 'LP':
    case 'Album':
    case 'Mini-Album':
      return [undefined, { type: 'album' }]
    case 'EP':
      return [undefined, { type: 'ep' }]
    case 'Maxi-Single':
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
    case 'Quadraphonic':
      return ['quadraphonic', {}]
    case 'HDCD':
      return [undefined, { format: 'hdcd' }]
    case 'VCD':
    case 'AVCD':
    case 'SVCD':
      return [undefined, { format: 'vcd' }]
    case 'DVD-Audio':
      return [undefined, { format: 'dvd-a' }]
    case '3 ¾ ips':
      return ['3 3/4 ips', {}]
    case '7 ½ ips':
      return ['7 1/2 ips', {}]
    case 'Mono':
    case '2-Track Mono':
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
  if (!format.descriptions) return [[], {}]

  let attributes: ReleaseAttribute[] = []
  let data: Partial<ResolveData> = {}
  for (const description of format.descriptions) {
    const [descAttribute, descResolveData] = parseAttribute(description)
    const descAttributeArray: ReleaseAttribute[] = descAttribute
      ? [descAttribute]
      : []
    attributes = [...attributes, ...descAttributeArray]
    data = mergeAndConcat(data, descResolveData)
  }
  return [attributes, data]
}

const resolveRelease = async (id: string): Promise<ResolveData> => {
  const response = JSON.parse(
    await fetch({
      url: `https://api.discogs.com/releases/${id}`,
      urlParameters: {
        key: client_key,
        secret: client_secret,
      },
    })
  ) as Release

  const url = response.uri
  const title = response.title
  const artists = response.artists.map((artist) =>
    // id 194 = various artists
    // we do this by id instead of name ('Various' on discogs) to allow for artists named 'Various'
    artist.id === 194 ? 'Various Artists' : artist.name
  )
  const date = !response.released ? undefined : parseDate(response.released)
  const tracks = response.tracklist.map((track) => ({
    position: track.position.replace('-', '.').replace(/(CD|DVD)\D?/, ''), // CD1-1 -> 1.1
    title: track.title,
    duration: track.duration,
  }))
  const type = getReleaseType(tracks.length)
  const coverArt = (response.images ?? []).map((image) => image.resource_url)
  const label = response.labels[0]

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

  // special case: demos are indicated in the "text" property of the format
  if (response.formats[0]?.text?.toLowerCase() === 'demo')
    attributes.push('demo')

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
      label,
    },
    partialResolveData
  )
  // de-dupe attributes
  resolveData.attributes = [...new Set(resolveData.attributes)]
  return resolveData
}

const getMasterPrimaryReleaseId = async (masterId: string) => {
  const response = JSON.parse(
    await fetch({
      url: `https://api.discogs.com/masters/${masterId}`,
      urlParameters: {
        key: client_key,
        secret: client_secret,
      },
    })
  ) as Master
  return response.main_release
}

export const resolve: ResolveFunction = async (url) => {
  const match = regex.exec(url)
  if (!match) throw new Error('Invalid Discogs URL')

  const type = match[5]
  if (!type || !isValidLinkType(type))
    throw new Error(
      `Expected link to be release/master. Received: ${String(type)}`
    )

  const id = match[6]
  if (!id) throw new Error('Could not find ID in link')

  const releaseId =
    type === 'release' ? id : (await getMasterPrimaryReleaseId(id)).toString()
  return resolveRelease(releaseId)
}
