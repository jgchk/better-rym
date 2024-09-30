import { pages, runPage } from '~/common/pages'

import { main } from '.'

void runPage(pages.releaseSubmission, () => {
  void main()
})
