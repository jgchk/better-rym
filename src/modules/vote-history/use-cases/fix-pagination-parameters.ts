import { waitForDocumentReady } from '~/common/utils/dom'

export default async function fixPaginationParameters(): Promise<void> {
  await waitForDocumentReady()

  const parameters = new URLSearchParams(window.location.search)
  const show = Number.parseInt(parameters.get('show') ?? '100')
  const start = Number.parseInt(parameters.get('start') ?? '0')

  for (const node of document.querySelectorAll<HTMLAnchorElement>(
    'a.navlinknum',
  )) {
    const pageNumber = Number.parseInt(node.text)

    parameters.set('show', show.toString())
    parameters.set('start', ((pageNumber - 1) * show).toString())

    node.href = window.location.pathname + '?' + parameters.toString()
  }

  for (const node of document.querySelectorAll<HTMLAnchorElement>(
    'a.navlinkprev',
  )) {
    parameters.set('show', show.toString())
    parameters.set('start', (start - show).toString())

    node.href = window.location.pathname + '?' + parameters.toString()
  }

  for (const node of document.querySelectorAll<HTMLAnchorElement>(
    'a.navlinknext',
  )) {
    parameters.set('show', show.toString())
    parameters.set('start', (start + show).toString())

    node.href = window.location.pathname + '?' + parameters.toString()
  }
}
