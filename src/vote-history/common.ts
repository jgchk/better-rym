import { waitForElement } from '../common/utils/dom'

export const fixPaginationParameters = (): void => {
  const parameters = new URLSearchParams(window.location.search)
  const show = Number.parseInt(parameters.get('show') ?? '100')
  const start = Number.parseInt(parameters.get('start') ?? '0')

  for (const node of document.querySelectorAll<HTMLAnchorElement>(
    'a.navlinknum'
  )) {
    const pageNumber = Number.parseInt(node.text)

    parameters.set('show', show.toString())
    parameters.set('start', ((pageNumber - 1) * show).toString())

    node.href = window.location.pathname + '?' + parameters.toString()
  }

  for (const node of document.querySelectorAll<HTMLAnchorElement>(
    'a.navlinkprev'
  )) {
    parameters.set('show', show.toString())
    parameters.set('start', (start - show).toString())

    node.href = window.location.pathname + '?' + parameters.toString()
  }

  for (const node of document.querySelectorAll<HTMLAnchorElement>(
    'a.navlinknext'
  )) {
    parameters.set('show', show.toString())
    parameters.set('start', (start + show).toString())

    node.href = window.location.pathname + '?' + parameters.toString()
  }
}

export const addDropdown = async (
  label: string,
  queryParameter: string,
  fetcher: () => Promise<{ id: string; name: string }[]>
): Promise<void> => {
  const table = await waitForElement('.mbgen')
  const div = document.createElement('div')
  div.innerHTML = `<label>${label}</label>`
  div.style.marginTop = '12px'
  div.style.marginBottom = '12px'
  table.before(div)

  const select = document.createElement('select')
  select.innerHTML = '<option value="">Loading...</option>'
  const parameters = new URLSearchParams(window.location.search)
  select.addEventListener('change', (event) => {
    const value = (event.target as HTMLSelectElement).value
    if (value === '') {
      parameters.delete(queryParameter)
    } else {
      parameters.set(queryParameter, value)
    }
    parameters.set('start', '0')
    window.location.search = '?' + parameters.toString()
  })
  select.style.marginLeft = '4px'
  div.append(select)

  const data = await fetcher()
  select.innerHTML = [
    '<option value="">all</option>',
    ...data.map((item) => `<option value="${item.id}">${item.name}</option>`),
  ].join('')
  select.value = parameters.get(queryParameter) ?? ''
}
