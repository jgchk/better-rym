import { getPageEnabled } from './common/pages'

const runPage = async (page: string, callback: () => unknown) => {
  if (!location.hostname.endsWith('rateyourmusic.com')) return
  if (!location.pathname.startsWith(page)) return

  const enabled = await getPageEnabled(page)
  if (!enabled) return

  callback()
}
