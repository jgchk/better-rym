import {
  DiscSize,
  ReleaseAttribute,
  ReleaseDate,
  ReleaseFormat,
  ReleaseType,
  ResolveData,
  Track,
} from '../../common/services/types'
import { forceQuerySelector } from '../../common/utils/dom'
import { isDefined, isNotNull } from '../../common/utils/types'
import { CapitalizationType, capitalize } from './capitalization'

const TYPE_IDS: Record<ReleaseType, string> = {
  album: 's',
  compilation: 't',
  ep: 'e',
  single: 'i',
  mixtape: 'm',
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
      const firstResult = iframe.contentDocument?.querySelector<HTMLDivElement>(
        'div.result'
      )
      if (isNotNull(firstResult) && isDefined(firstResult)) {
        resolve(firstResult)
      } else {
        resolve(undefined)
      }

      iframe.removeEventListener('load', listener)
    }
    iframe.addEventListener('load', listener)
  })

const fillArtist = async (artist: string) => {
  // Enter search term
  const input = forceQuerySelector<HTMLInputElement>(document)(
    'input#filed_under_searchterm'
  )
  input.value = artist

  // Click search button
  const submitButton = forceQuerySelector<HTMLInputElement>(document)(
    '#section_filed_under .gosearch input[type=button]'
  )
  submitButton.click()

  // Wait for results
  const iframe = forceQuerySelector<HTMLIFrameElement>(document)(
    'iframe#filed_underlist'
  )
  const topResult = await waitForResult(iframe)

  // Click the top result if there is one
  topResult?.click()
}

const fillArtists = async (artists: string[]) => {
  if (artists[0]?.toLowerCase() === 'various artists') {
    // Various Artists release
    const element = forceQuerySelector<HTMLInputElement>(document)(
      `input#cat_va`
    )
    element.click()
  } else {
    // Regular release
    const alreadyFilled = isNotNull(
      document.querySelector('.sortable_filed_under')
    )
    if (alreadyFilled) return

    for (const artist of artists) {
      await fillArtist(artist)
    }
  }
}

const fillType = (type: ReleaseType) => {
  const element = forceQuerySelector<HTMLInputElement>(document)(
    `input#category${TYPE_IDS[type]}`
  )
  element.checked = true
}

const fillYear = (year: number) => {
  const element = forceQuerySelector<HTMLSelectElement>(document)('select#year')
  element.value = year.toString()
}

const fillMonth = (month: number) => {
  const element = forceQuerySelector<HTMLSelectElement>(document)(
    'select#month'
  )
  element.value = month.toString().padStart(2, '0')
}

const fillDay = (day: number) => {
  const element = forceQuerySelector<HTMLSelectElement>(document)('select#day')
  element.value = day.toString().padStart(2, '0')
}

const fillDate = (date: ReleaseDate) => {
  if (isDefined(date.year)) fillYear(date.year)
  if (isDefined(date.month)) fillMonth(date.month)
  if (isDefined(date.day)) fillDay(date.day)
}

const fillTitle = (title: string, capitalization: CapitalizationType) => {
  const element = forceQuerySelector<HTMLInputElement>(document)('input#title')
  element.value = capitalize(title, capitalization)
}

const fillFormat = (format: ReleaseFormat) => {
  const element = forceQuerySelector<HTMLInputElement>(document)(
    `input#format${FORMAT_IDS[format]}`
  )
  element.checked = true
}

const fillDiscSize = (discSize: DiscSize) => {
  const element = forceQuerySelector<HTMLInputElement>(document)(
    `input#disc_size${DISC_SIZE_IDS[discSize]}`
  )
  element.checked = true
}

const fillAttribute = (attribute: ReleaseAttribute) => {
  const element = forceQuerySelector<HTMLInputElement>(document)(
    `input#attrib${ATTRIBUTE_IDS[attribute]}`
  )
  element.checked = true
}

const fillAttributes = (attributes: ReleaseAttribute[]) => {
  for (const attribute of attributes) {
    fillAttribute(attribute)
  }
}

const fillTracks = (tracks: Track[], capitalization: CapitalizationType) => {
  const tracksString = tracks
    .map((track, index) => {
      const position = track.position ?? index + 1
      const title = capitalize(track.title ?? '', capitalization)
      const duration = track.duration ?? ''
      return `${position}|${title}|${duration}`
    })
    .join('\n')

  const advancedButton = forceQuerySelector<HTMLAnchorElement>(document)(
    'a#goAdvancedBtn'
  )
  advancedButton.click()

  const advancedInput = forceQuerySelector<HTMLTextAreaElement>(document)(
    'textarea#track_advanced'
  )
  advancedInput.value = tracksString

  const simpleButton = forceQuerySelector<HTMLAnchorElement>(document)(
    'a#goSimpleBtn'
  )
  simpleButton.click()
}

const fillSource = (url: string) => {
  const element = forceQuerySelector<HTMLTextAreaElement>(document)(
    'textarea#notes'
  )
  element.value = url
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
  }: ResolveData,
  capitalization: CapitalizationType
): Promise<void> => {
  if (isDefined(artists)) await fillArtists(artists)
  if (isDefined(type)) fillType(type)
  if (isDefined(date)) fillDate(date)
  if (isDefined(title)) fillTitle(title, capitalization)
  if (isDefined(format)) fillFormat(format)
  if (isDefined(discSize)) fillDiscSize(discSize)
  if (isDefined(attributes)) fillAttributes(attributes)
  if (isDefined(tracks)) fillTracks(tracks, capitalization)
  if (isDefined(url)) fillSource(url)
}
