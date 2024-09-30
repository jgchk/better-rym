import { pages, runPage } from '~/common/pages'

import { injectStreamLinkConverter } from '.'

void runPage(pages.streamLinkSubmission, () => {
  void injectStreamLinkConverter()
})
