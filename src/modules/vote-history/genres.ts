import { pages, runPage } from '~/common/pages'

import addGenreDropdown from './use-cases/add-genre-dropdown'
import fixPaginationParameters from './use-cases/fix-pagination-parameters'

async function main() {
  await Promise.all([fixPaginationParameters(), addGenreDropdown()])
}

void runPage(pages.voteHistoryGenres, () => {
  void main()
})
