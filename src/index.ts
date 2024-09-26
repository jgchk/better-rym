import { getPageEnabled, pages } from './common/pages'
import { main as coverArt } from './modules/cover-art'
import { main as releaseSubmission } from './modules/release-submission'
import { main as searchBar } from './modules/search-bar'
import { main as streamLinkMissing } from './modules/stream-link-missing'
import { main as streamLinkSubmission } from './modules/stream-link-submission'
import { main as userCollection } from './modules/user-collection'
import { main as userPage } from './modules/user-page'
import { main as voteHistoryDescriptors } from './modules/vote-history/descriptors'
import { main as voteHistoryGenres } from './modules/vote-history/genres'

const runPage = async (page: string, callback: () => unknown) => {
  if (!location.hostname.endsWith('rateyourmusic.com')) return
  if (!location.pathname.startsWith(page)) return

  const enabled = await getPageEnabled(page)
  if (!enabled) return

  callback()
}

void runPage(pages.releaseSubmission, releaseSubmission)
void runPage(pages.coverArt, coverArt)
void runPage(pages.streamLinkSubmission, streamLinkSubmission)
void runPage(pages.userCollection, userCollection)
void runPage(pages.filmCollection, userCollection)
void runPage(pages.userPage, userPage)
void runPage(pages.voteHistoryGenres, voteHistoryGenres)
void runPage(pages.voteHistoryDescriptors, voteHistoryDescriptors)
void runPage(pages.streamLinkMissing, streamLinkMissing)
void searchBar()
