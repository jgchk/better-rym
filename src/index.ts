import { getPageEnabled, pages } from './common/pages'
import { main as searchBar } from './modules/search-bar'
import { main as streamLinkMissing } from './modules/stream-link-missing'

const runPage = async (page: string, callback: () => unknown) => {
  if (!location.hostname.endsWith('rateyourmusic.com')) return
  if (!location.pathname.startsWith(page)) return

  const enabled = await getPageEnabled(page)
  if (!enabled) return

  callback()
}

void runPage(pages.streamLinkMissing, streamLinkMissing)
void searchBar()
