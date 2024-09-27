import { uniqueBy } from '../../common/utils/array'
import { withCache } from '../../common/utils/cache'
import { waitForDocumentReady } from '../../common/utils/dom'
import { fetch } from '../../common/utils/fetch'
import { pipe } from '../../common/utils/pipe'
import { addDropdown, fixPaginationParameters } from './common'

const getDescriptors = withCache(
  'descriptors',
  async () => {
    const response = await fetch({
      url: 'https://rateyourmusic.com/music_descriptor/',
    })
    const document_ = new DOMParser().parseFromString(response, 'text/html')

    const descriptorElements = document_.querySelectorAll<HTMLAnchorElement>(
      "a.genre[href^='/music_descriptor']"
    )

    const descriptors = pipe(
      [...descriptorElements].map((element) => ({
        name: element.text,
        id: element.title.slice(11, -1), // '[Descriptor37944]' -> 37944
        link: element.href,
      })),
      uniqueBy((descriptor) => descriptor.id),
      (array) =>
        array.sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        )
    )

    return descriptors
  },
  604_800_000
)

export const main = () =>
  Promise.all([
    waitForDocumentReady().then(() => fixPaginationParameters()),
    addDropdown('Descriptor', 'descriptor', getDescriptors),
  ])

void main()
