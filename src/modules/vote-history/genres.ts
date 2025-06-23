import { pages, runPage } from '~/common/pages'

import runCommonVoteHistoryLogic from './common'
import addGenreDropdown from './use-cases/add-genre-dropdown'

async function main(): Promise<void> {
  await runCommonVoteHistoryLogic()
  await addGenreDropdown()
}

void runPage(pages.voteHistoryGenres, () => {
  void main()
})
