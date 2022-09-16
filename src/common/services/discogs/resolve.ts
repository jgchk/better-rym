import { fetch } from '../../../common/utils/fetch'
import { getReleaseType } from '../../utils/music'
import {
  DiscSize,
  ReleaseDate,
  ReleaseLabel,
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

const parseFormatName = (data: ResolveData, format: Format) => {
  switch (format.name) {
    case 'Vinyl':
    case 'Flexi-disc':
    case 'Lathe Cut':
    case 'Pathé Disc':
    case 'Edison Disc': {
      data.format = 'vinyl'
      break
    }
    case 'Acetate': {
      data.format = 'acetate'
      break
    }
    case 'Shellac': {
      data.format = 'shellac'
      break
    }
    case 'Cylinder': {
      data.format = 'phonograph cylinder'
      break
    }
    case 'CD': {
      data.format = 'cd'
      break
    }
    case 'CDr': {
      data.format = 'cd-r'
      break
    }
    case 'DVD':
    case 'HD DVD': {
      data.format = 'dvd'
      data.type = 'video'
      break
    }
    case 'DVDr':
    case 'HD DVD-R': {
      data.format = 'dvd-r'
      data.type = 'video'
      break
    }
    case 'Blu-ray':
    case 'Blu-ray-R': {
      data.format = 'blu-ray'
      data.type = 'video'
      break
    }
    case 'SACD': {
      data.format = 'sacd'
      break
    }
    case '4-Track Cartridge': {
      data.format = '4 track'
      break
    }
    case '8-Track Cartridge': {
      data.format = '8 track'
      break
    }
    case 'Cassette':
    case 'DC-International':
    case 'Elcaset':
    case 'RCA Tape Cartridge':
    case 'Pocket Rocker':
    case 'Revere Magnetic Stereo Tape Ca':
    case 'Tefifon':
    case 'Sabamobil': {
      data.format = 'cassette'
      break
    }
    case 'Microcassette':
    case 'NT Cassette': {
      data.format = 'microcasette'
      break
    }
    case 'PlayTape': {
      data.format = 'playtape'
      break
    }
    case 'DAT': {
      data.format = 'dat'
      break
    }
    case 'DCC': {
      data.format = 'dcc'
      break
    }
    case 'Betacam':
    case 'Betacam SP':
    case 'Betamax': {
      data.format = 'beta'
      data.type = 'video'
      break
    }
    case 'Cartrivision':
    case 'MiniDV':
    case 'U-matic':
    case 'VHS':
    case 'Video 2000':
    case 'Video8': {
      data.format = 'vhs'
      data.type = 'video'
      break
    }
    case 'Reel-To-Reel':
    case 'Film Reel': {
      data.format = 'reel-to-reel'
      break
    }
    case 'CDV':
    case 'Laserdisc':
    case 'SelectaVision':
    case 'VHD': {
      data.format = 'laserdisc'
      data.type = 'video'
      break
    }
    case 'Minidisc':
    case 'MVD':
    case 'UMD': {
      data.format = 'minidisc'
      break
    }
    case 'Floppy Disk': {
      data.format = 'digital file'
      break
    }
    case 'File': {
      data.format = 'digital file'
      data.attributes = [...(data.attributes ?? []), 'downloadable']
      break
    }
    case 'Memory Stick': {
      data.format = 'digital file'
      data.attributes = [...(data.attributes ?? []), 'usb/flash drive']
      break
    }
    case 'Box Set': {
      data.attributes = [...(data.attributes ?? []), 'box set']
      break
    }
  }
}

const parseFormatDescription = (
  data: ResolveData,
  desc: FormatDescription | string
) => {
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
    case '3"': {
      data.discSize = desc.slice(0, -1) as DiscSize
      break
    }
    case '6½"':
    case '5½"':
    case '3½"':
    case '2"':
    case '1"': {
      data.discSize = 'non-standard'
      break
    }
    case '16 ⅔ RPM': {
      data.attributes = [...(data.attributes ?? []), '16 rpm']
      break
    }
    case '33 ⅓ RPM': {
      data.attributes = [...(data.attributes ?? []), '33 rpm']
      break
    }
    case '45 RPM': {
      data.attributes = [...(data.attributes ?? []), '45 rpm']
      break
    }
    case '78 RPM': {
      data.attributes = [...(data.attributes ?? []), '78 rpm']
      break
    }
    case '80 RPM': {
      data.attributes = [...(data.attributes ?? []), '80 rpm']
      break
    }
    case 'Single Sided': {
      data.attributes = [...(data.attributes ?? []), 'single-sided']
      break
    }
    case 'Advance': {
      data.attributes = [...(data.attributes ?? []), 'promo']
      break
    }
    case 'LP': {
      data.type = 'album'
      data.discSize = data.discSize ?? '12' // discogs LPs are 12" by default (https://github.com/jgchk/better-rym/issues/140)
      break
    }
    case 'Album': {
      data.type = 'album'
      break
    }
    case 'Mini-Album':
    case 'EP': {
      data.type = 'ep'
      break
    }
    case 'Maxi-Single':
    case 'Single': {
      data.type = 'single'
      break
    }
    case 'Compilation': {
      data.type = 'compilation'
      break
    }
    case 'Club Edition': {
      data.attributes = [...(data.attributes ?? []), 'fan club release']
      break
    }
    case 'Deluxe Edition': {
      data.attributes = [...(data.attributes ?? []), 'deluxe edition']
      break
    }
    case 'Enhanced': {
      data.attributes = [...(data.attributes ?? []), 'enhanced cd']
      break
    }
    case 'Etched': {
      data.attributes = [...(data.attributes ?? []), 'etched']
      break
    }
    case 'Limited Edition': {
      data.attributes = [...(data.attributes ?? []), 'limited edition']
      break
    }
    case 'Mixtape': {
      data.type = 'mixtape'
      break
    }
    case 'Numbered': {
      data.attributes = [...(data.attributes ?? []), 'numbered edition']
      break
    }
    case 'Picture Disc': {
      data.attributes = [...(data.attributes ?? []), 'picture disc']
      break
    }
    case 'Promo': {
      data.attributes = [...(data.attributes ?? []), 'promo']
      break
    }
    case 'Remastered': {
      data.attributes = [...(data.attributes ?? []), 'remastered']
      break
    }
    case 'Test Pressing': {
      data.attributes = [...(data.attributes ?? []), 'test pressing']
      break
    }
    case 'Transcription': {
      // "transcription releases are releases given to a radio station for broadcast.
      //  rym doesn't have a specific tag for this, but the promo tag is the same thing"
      //      - via https://github.com/jgchk/better-rym/issues/141
      data.attributes = [...(data.attributes ?? []), 'promo']
      break
    }
    case 'Unofficial Release': {
      data.type = 'bootleg'
      break
    }
    case 'White Label': {
      data.attributes = [...(data.attributes ?? []), 'test pressing']
      break
    }
    case 'Quadraphonic': {
      data.attributes = [...(data.attributes ?? []), 'quadraphonic']
      break
    }
    case 'HDCD': {
      data.format = 'hdcd'
      break
    }
    case 'VCD':
    case 'AVCD':
    case 'SVCD': {
      data.format = 'vcd'
      data.type = 'video'
      break
    }
    case 'DVD-Audio': {
      data.format = 'dvd-a'
      break
    }
    case '3 ¾ ips': {
      data.attributes = [...(data.attributes ?? []), '3 3/4 ips']
      break
    }
    case '7 ½ ips': {
      data.attributes = [...(data.attributes ?? []), '7 1/2 ips']
      break
    }
    case 'Mono':
    case '2-Track Mono':
    case '4-Track Mono': {
      data.attributes = [...(data.attributes ?? []), 'mono']
      break
    }
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
    case 'WMA': {
      data.format = 'lossless digital'
      break
    }
    case 'DualDisc': {
      data.format = 'dualdisc'
      break
    }
  }
}

const parseFormatDescriptions = (data: ResolveData, format: Format) => {
  if (!format.descriptions) return

  for (const description of format.descriptions) {
    parseFormatDescription(data, description)
  }
}

const parseFormatText = (data: ResolveData, format: Format) => {
  switch (format.text?.toLowerCase()) {
    case 'demo': {
      data.attributes = [...(data.attributes ?? []), 'demo']
      break
    }
    case 'gatefold': {
      data.attributes = [...(data.attributes ?? []), 'gatefold']
      break
    }
    case 'cardboard sleeve': {
      data.attributes = [...(data.attributes ?? []), 'paper/cardboard sleeve']
      break
    }
    case 'book': {
      data.attributes = [...(data.attributes ?? []), 'digibook']
      break
    }
    case 'digipak':
    case 'digipack': {
      data.attributes = [...(data.attributes ?? []), 'digipak']
    }
  }
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
    header: track.type_ === 'heading',
  }))
  const type = getReleaseType(tracks.length)
  const coverArt = (response.images ?? [])
    .map((image) => image.resource_url)
    .filter((url) => url.length > 0)
  const label: ReleaseLabel = response.labels[0]
  if (label.catno === 'none') label.catno = undefined

  const data: ResolveData = {
    url,
    title,
    artists,
    date,
    type,
    tracks,
    coverArt,
    label,
  }

  const format = response.formats[0]
  if (format) {
    parseFormatDescriptions(data, format)
    parseFormatName(data, format)
    parseFormatText(data, format)
  }

  // de-dupe attributes
  data.attributes = [...new Set(data.attributes)]

  return data
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

  let releaseId
  if (type === 'release') {
    releaseId = id
  } else {
    const masterReleaseId = await getMasterPrimaryReleaseId(id)
    releaseId = masterReleaseId.toString()
  }

  return resolveRelease(releaseId)
}
