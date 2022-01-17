import { withCache } from '../../common/utils/cache'
import { waitForDocumentReady } from '../../common/utils/dom'
import { fetch } from '../../common/utils/fetch'
import { addDropdown, fixPaginationParameters } from './common'

const getGenres = withCache(
  'genres',
  async () => {
    const response = await fetch({
      url: 'https://rateyourmusic.com/admin/queue/hq/profile_history?type=h&context=p&showall=1',
    })
    const document_ = new DOMParser().parseFromString(response, 'text/html')

    const approved = [...document_.querySelectorAll('.tblstandard tr')].filter(
      (node) => node.querySelector('td:nth-of-type(7)')?.textContent === 'a'
    )

    const genreMap: { [id: string]: { name: string; id: string } } = {}
    for (const element of approved.reverse()) {
      const status = element.querySelector('td:nth-of-type(3)')?.textContent
      const name = element.querySelector('td:nth-of-type(4)')?.textContent
      const id = element
        .querySelector('td:nth-of-type(5)')
        ?.textContent?.slice(6, -1)
      if (!name || !id) continue

      if (status === 'Delete' || status === 'Merge') {
        delete genreMap[id]
      } else {
        genreMap[id] = { id, name }
      }
    }

    return Object.values(genreMap).sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    )
  },
  604_800_000
)

const main = () =>
  Promise.all([
    waitForDocumentReady().then(() => fixPaginationParameters()),
    addDropdown('Genre', 'genre', getGenres),
  ])

void main()
