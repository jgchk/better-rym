import { pages, runPage } from '~/common/pages'

import runCommonVoteHistoryLogic from './common'
import { FILM_CACHE_KEY, FILM_GENRES_CSV_URL } from './remote-data'
import addDropdown from './use-cases/add-dropdown'

async function main(): Promise<void> {
  // Run common logic first (pagination fix + toggle link)
  await runCommonVoteHistoryLogic()

  try {
    await addDropdown('Genre', 'genre', FILM_CACHE_KEY, FILM_GENRES_CSV_URL, 'filmGenres')
    // eslint-disable-next-line no-console
    console.log('BetterRYM: Initialized film genre dropdown.')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('BetterRYM: Failed to initialize film genre dropdown:', error)
  }
}

void runPage(pages.voteHistoryFilms, () => {
  void main()
}) 