import { pages, runPage } from '~/common/pages'

import { injectCollectionFilterButtons } from '.'

const isUserCollection = document.location.pathname.startsWith(
  pages.userCollection,
)

const page = isUserCollection ? pages.userCollection : pages.filmCollection

void runPage(page, () => {
  void injectCollectionFilterButtons()
})
