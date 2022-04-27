import { getPageEnabled, pages } from './common/pages'

const runPage = async (page: string, callback: () => unknown) => {
  if (!location.pathname.startsWith(page)) return

  const enabled = await getPageEnabled(page)
  if (!enabled) return

  callback()
}

void runPage(pages.streamLinks, () => import('./modules/stream-links'))
void runPage(pages.suggestions, () => import('./modules/suggestions'))
void runPage(
  pages.releaseSubmission,
  () => import('./modules/release-submission')
)
void runPage(pages.coverArt, () => import('./modules/cover-art'))
void runPage(
  pages.streamLinkSubmission,
  () => import('./modules/stream-link-submission')
)
void runPage(pages.userCollection, () => import('./modules/user-collection'))
void runPage(pages.filmCollection, () => import('./modules/user-collection'))
void runPage(pages.userPage, () => import('./modules/user-page'))
void runPage(
  pages.voteHistoryGenres,
  () => import('./modules/vote-history/genres')
)
void runPage(
  pages.voteHistoryDescriptors,
  () => import('./modules/vote-history/descriptors')
)
void runPage(
  pages.streamLinkMissing,
  () => import('./modules/stream-link-missing')
)

import('./modules/search-bar')
