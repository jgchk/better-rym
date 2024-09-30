import { pages, runPage } from '~/common/pages'

import { injectCoverArtDownloader } from '.'

void runPage(pages.coverArt, () => {
  void injectCoverArtDownloader()
})
