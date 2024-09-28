import { FunctionComponent, h } from 'preact'
import { useMemo } from 'preact/hooks'

export const FilterButton: FunctionComponent<{
  name: string
  base: string
  modifier: string
}> = ({ name, base, modifier }) => {
  const url = useMemo(() => makeUrl(base, modifier), [base, modifier])
  const applied = filterApplied(modifier) ? 'background: var(--mono-7)' : ''
  return (
    <a className='btn' style={applied} href={url}>
      {name.toLowerCase()}
    </a>
  )
}

function makeUrl(base: string, modifier: string) {
  const path = window.location.pathname.split('/')
  const collectionIndex = path.findIndex(
    (element) =>
      element.toLowerCase() === 'collection' ||
      element.toLowerCase() === 'film_collection',
  )
  const modifiers = [
    ...(path[collectionIndex + 2] || '')
      .split(/\s*,\s*/)
      .filter((module) => !module.startsWith(base)),
    filterApplied(modifier) ? '' : modifier,
  ]
    .filter((s) => s.length > 0)
    .join(',')
  path[collectionIndex + 2] = modifiers
  const newPath = path.filter((s) => s.length > 0).join('/')
  return `/${newPath}`
}

function filterApplied(modifier: string) {
  const path = window.location.pathname.split('/')
  const collectionIndex = path.findIndex(
    (element) =>
      element.toLowerCase() === 'collection' ||
      element.toLowerCase() === 'film_collection',
  )
  return (path[collectionIndex + 2] || '').split(/\s*,\s*/).includes(modifier)
}
