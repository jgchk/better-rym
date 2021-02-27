import { FunctionComponent, h } from 'preact'
import { useMemo } from 'preact/hooks'

const makeUrl = (modifier: string) => {
  const path = window.location.pathname.split('/')
  const collectionIndex = path.findIndex(
    (element) => element.toLowerCase() === 'collection'
  )
  const modifiers = [
    ...(path[collectionIndex + 2] || '')
      .split(/\s*,\s*/)
      .filter((module) => !module.startsWith('typ')),
    modifier,
  ]
    .filter((s) => s.length > 0)
    .join(',')
  path[collectionIndex + 2] = modifiers
  const newPath = path.filter((s) => s.length > 0).join('/')
  return `/${newPath}`
}

export const Button: FunctionComponent<{
  name: string
  modifier: string
}> = ({ name, modifier }) => {
  const url = useMemo(() => makeUrl(modifier), [modifier])
  return (
    <a className='printbutton' href={url}>
      {name.toLowerCase()}
    </a>
  )
}
