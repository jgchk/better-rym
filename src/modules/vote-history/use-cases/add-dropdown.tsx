import { h, render } from 'preact'

import { waitForElement } from '~/common/utils/dom'

export default async function addDropdown(
  label: string,
  queryParameter: string,
  items: DropdownItem[],
): Promise<void> {
  const table = await waitForElement('.mbgen')
  const container = document.createElement('div')
  table.before(container)

  render(
    <Dropdown label={label} queryParameter={queryParameter} items={items} />,
    container,
  )
}

function Dropdown({ label, queryParameter, items }: DropdownProps) {
  const parameters = new URLSearchParams(window.location.search)

  const handleChange = (event: Event) => {
    const value = (event.target as HTMLSelectElement).value
    if (value === '') {
      parameters.delete(queryParameter)
    } else {
      parameters.set(queryParameter, value)
    }
    parameters.set('start', '0')
    window.location.search = '?' + parameters.toString()
  }

  return (
    <div style={{ marginTop: '12px', marginBottom: '12px' }}>
      <label htmlFor={`brym-vote-history-${label}`}>{label}</label>
      <select
        id={`brym-vote-history-${label}`}
        style={{ marginLeft: '4px' }}
        onChange={handleChange}
        value={parameters.get(queryParameter) ?? ''}
      >
        <option value=''>all</option>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  )
}

type DropdownProps = {
  label: string
  queryParameter: string
  items: DropdownItem[]
}

type DropdownItem = {
  id: string
  name: string
}
