import * as storage from './utils/storage'

export const pages = {
  streamLinks: '/release/',
  releaseSubmission: '/releases/ac',
  coverArt: '/images/upload',
  streamLinkSubmission: '/submit_media_link',
  userCollection: '/collection',
  filmCollection: '/film_collection',
  userPage: '/~',
  voteHistoryGenres: '/rgenre/vote_history',
  voteHistoryDescriptors: '/rdescriptor/vote_history',
  streamLinkMissing: '/misc/media_link_you_know',
}

export const getPageEnabled = async (page: string): Promise<boolean> =>
  (await storage.get<boolean>(`pages.${page}`)) ?? true
export const setPageEnabled = async (
  page: string,
  enabled: boolean,
): Promise<void> => storage.set(`pages.${page}`, enabled)

export const runPage = async (page: string, callback: () => unknown) => {
  const enabled = await getPageEnabled(page)
  if (!enabled) return

  callback()
}
