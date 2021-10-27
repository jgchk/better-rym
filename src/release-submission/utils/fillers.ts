import {
  DiscSize,
  ReleaseAttribute,
  ReleaseDate,
  ReleaseFormat,
  ReleaseLabel,
  ReleaseType,
  ResolveData,
  Track,
} from '../../common/services/types'
import { forceQuerySelector } from '../../common/utils/dom'
import { pipe } from '../../common/utils/pipe'
import { ifDefined } from '../../common/utils/types'
import { CapitalizationType, capitalize } from './capitalization'
import { ReleaseOptions } from './types'

const TYPE_IDS: Record<ReleaseType, string> = {
  album: 's',
  compilation: 't',
  ep: 'e',
  single: 'i',
  mixtape: 'm',
  'music video': 'o',
  'dj mix': 'j',
  bootleg: 'b',
  video: 'd',
}

const FORMAT_IDS: Record<ReleaseFormat, number> = {
  'digital file': 58,
  'lossless digital': 59,
  'blu-ray': 88,
  cd: 60,
  'cd-r': 32,
  dualdisc: 54,
  dvd: 78,
  'dvd-a': 77,
  'dvd-r': 100,
  hdad: 62,
  hdcd: 83,
  laserdisc: 89,
  minidisc: 48,
  sacd: 76,
  umd: 81,
  vcd: 79,
  vinyl: 95,
  shellac: 96,
  '8 track': 21,
  '4 track': 103,
  acetate: 80,
  beta: 41,
  cassette: 66,
  dat: 104,
  dcc: 105,
  microcasette: 101,
  playtape: 102,
  'reel-to-reel': 92,
  vhs: 40,
  'phonograph cylinder': 91,
}

const DISC_SIZE_IDS: Record<DiscSize, number> = {
  '16': 93,
  '12': 88,
  '11': 94,
  '10': 89,
  '9': 95,
  '8': 96,
  '7': 90,
  '6': 97,
  '5': 91,
  '4': 98,
  '3': 92,
  'non-standard': 99,
}

const ATTRIBUTE_IDS: Record<ReleaseAttribute, number> = {
  abridged: 37,
  'bonus cd': 50,
  'bonus dvd': 51,
  'bonus flash drive': 82,
  'bonus tracks': 62,
  censored: 47,
  'content/copy protected': 61,
  'digital download': 101,
  'duophonic/electronically rechanneled stereo': 102,
  'enhanced cd': 63,
  mono: 75,
  quadraphonic: 103,
  remastered: 23,
  're-recorded': 29,
  'single-sided': 104,
  'anniversary edition': 120,
  'box set': 12,
  "collector's edition": 49,
  'deluxe edition': 59,
  demo: 18,
  exclusive: 72,
  'fan club release': 38,
  'limited edition': 16,
  'numbered edition': 73,
  promo: 11,
  'unauthorized mixtape/dj mix': 100,
  'amaray case': 67,
  'cd sized album replica': 60,
  digibook: 109,
  digipak: 21,
  gatefold: 30,
  handmade: 33,
  'jewel case': 76,
  'musicpac/slidepac': 110,
  'no artwork': 83,
  'paper/cardboard sleeve': 81,
  'slipcase/o-card': 111,
  'usb/flash drive': 80,
  'colored vinyl': 32,
  etched: 105,
  'flexi-disc': 66,
  'multi-groove': 106,
  'picture disc': 31,
  'test pressing': 108,
  'white label': 107,
  '120 gram': 43,
  '140 gram': 115,
  '150 gram': 116,
  '160 gram': 117,
  '180 gram': 44,
  '200 gram': 118,
  '220 gram': 119,
  '16 rpm': 40,
  '33 rpm': 19,
  '45 rpm': 41,
  '78 rpm': 42,
  '80 rpm': 112,
  '3 3/4 ips': 113,
  '7 1/2 ips': 114,
  'gold disc': 52,
  shm: 86,
  downloadable: 122,
  streaming: 123,
  remixes: 24,
  'selector comp': 10,
  archival: 7,
  'creative commons': 78,
  interview: 14,
  live: 5,
  'nsbm/nazi material': 77,
  'cast recording': 57,
  'film score': 53,
  'motion picture soundtrack': 54,
  'songs inspired by': 69,
  'television soundtrack': 55,
  'video game soundtrack': 56,
}

const waitForResult = (
  iframe: HTMLIFrameElement
): Promise<HTMLDivElement | undefined> =>
  new Promise((resolve) => {
    const listener = () => {
      const firstResult =
        iframe.contentDocument?.querySelector<HTMLDivElement>('div.result')

      if (firstResult != null) resolve(firstResult)
      else resolve(undefined)

      iframe.removeEventListener('load', listener)
    }
    iframe.addEventListener('load', listener)
  })

const fillArtist = async (artist: string) => {
  // Enter search term
  forceQuerySelector<HTMLInputElement>(document)(
    '#filed_under_searchterm'
  ).value = artist

  // Click search button
  forceQuerySelector<HTMLInputElement>(document)(
    '#section_filed_under .gosearch input[type=button]'
  ).click()

  // Wait for results
  const topResult = await waitForResult(
    forceQuerySelector<HTMLIFrameElement>(document)('#filed_underlist')
  )

  // Click the top result if there is one
  topResult?.click()
}

const fillArtists = async (artists: string[]) => {
  if (artists[0]?.toLowerCase() === 'various artists') {
    // Various Artists release
    forceQuerySelector<HTMLInputElement>(document)('#cat_va').click()
  } else {
    // Regular release
    if (document.querySelector('.sortable_filed_under') != null) return

    for (const artist of artists) await fillArtist(artist)
  }
}

const fillType = (type: ReleaseType) => {
  const element = forceQuerySelector<HTMLInputElement>(document)(
    `input#category${TYPE_IDS[type]}`
  )
  element.click() // click to trigger DOM onClick events (e.g. field updates on 'music video' click)
  element.checked = true // ensure that element is checked
}

const fillYear = (year: number) => {
  forceQuerySelector<HTMLSelectElement>(document)('#year').value =
    year.toString()
}

const fillMonth = (month: number) => {
  forceQuerySelector<HTMLSelectElement>(document)('#month').value = month
    .toString()
    .padStart(2, '0')
}

const fillDay = (day: number) => {
  forceQuerySelector<HTMLSelectElement>(document)('#day').value = day
    .toString()
    .padStart(2, '0')
}

const fillDate = (date: ReleaseDate) => {
  if (date.year !== undefined) fillYear(date.year)
  if (date.month !== undefined) fillMonth(date.month)
  if (date.day !== undefined) fillDay(date.day)
}

const fillTitle = (title: string, capitalization: CapitalizationType) => {
  forceQuerySelector<HTMLInputElement>(document)('#title').value = capitalize(
    title,
    capitalization
  )
}

const fillFormat = (format: ReleaseFormat) => {
  forceQuerySelector<HTMLInputElement>(document)(
    `#format${FORMAT_IDS[format]}`
  ).checked = true
}

const fillDiscSize = (discSize: DiscSize) => {
  forceQuerySelector<HTMLInputElement>(document)(
    `#disc_size${DISC_SIZE_IDS[discSize]}`
  ).checked = true
}

const fillAttribute = (attribute: ReleaseAttribute) => {
  forceQuerySelector<HTMLInputElement>(document)(
    `#attrib${ATTRIBUTE_IDS[attribute]}`
  ).checked = true
}

const fillAttributes = (attributes: ReleaseAttribute[]) => {
  for (const attribute of attributes) fillAttribute(attribute)
}

const fillTracks = (tracks: Track[], capitalization: CapitalizationType) => {
  const tracksString = tracks
    .map((track, index) => {
      const position = track.position ?? index + 1
      const title =
        pipe(
          track.title,
          ifDefined((title) =>
            title.toLowerCase() === 'untitled'
              ? '[untitled]'
              : capitalize(title, capitalization)
          )
        ) ?? ''
      const duration = track.duration ?? ''
      return `${position}|${title}|${duration}`
    })
    .join('\n')

  forceQuerySelector<HTMLAnchorElement>(document)('#goAdvancedBtn').click()
  forceQuerySelector<HTMLTextAreaElement>(document)('#track_advanced').value =
    tracksString
  forceQuerySelector<HTMLAnchorElement>(document)('#goSimpleBtn').click()
}

const fillLabel = (label: ReleaseLabel) => {
  forceQuerySelector<HTMLInputElement>(document)(
    '#label~table #searchterm'
  ).value = label.name ?? ''

  if (label.name)
    forceQuerySelector<HTMLInputElement>(document)(
      '#label~table .gosearch .btn'
    ).click()

  forceQuerySelector<HTMLInputElement>(document)('#catalog_no').value =
    label.catno ?? ''
}

const fillSource = (url: string) => {
  forceQuerySelector<HTMLTextAreaElement>(document)('#notes').value = url
}

export const fill = async (
  {
    artists,
    type,
    date,
    title,
    format,
    discSize,
    attributes,
    tracks,
    url,
    label,
  }: ResolveData,
  options: ReleaseOptions
): Promise<void> => {
  if (artists != null && options.fillFields.artists) await fillArtists(artists)
  if (type != null && options.fillFields.type) fillType(type)
  if (date != null && options.fillFields.date) fillDate(date)
  if (title != null && options.fillFields.title)
    fillTitle(title, options.capitalization)
  if (format != null && options.fillFields.format) fillFormat(format)
  if (discSize != null && options.fillFields.discSize) fillDiscSize(discSize)
  if (label != null && options.fillFields.label) fillLabel(label)
  if (attributes != null && options.fillFields.attributes)
    fillAttributes(attributes)
  if (tracks != null && options.fillFields.tracks)
    fillTracks(tracks, options.capitalization)
  if (url !== undefined) fillSource(url)
}
