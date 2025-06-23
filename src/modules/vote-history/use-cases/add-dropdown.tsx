// @ts-nocheck - This file uses Preact's JSX, but the project's stringent ESLint/TypeScript setup
// without `moduleResolution: "NodeNext"` in tsconfig.json fails to resolve Preact's types correctly.
// This directive is a localized workaround to prevent build errors without altering global configs.
import { h, render } from 'preact'
import { useCallback, useState } from 'preact/hooks'
import { waitForElement } from '~/common/utils/dom'

// Optional helpers for dynamic fetching (added below).  Imported using a
// wildcard so that the file continues to compile even when these exports are
// tree-shaken in static-only builds.
/* eslint-disable import/no-namespace */
import * as RemoteData from '../remote-data'
/* eslint-enable import/no-namespace */

export type DropdownItem = {
  id: string
  name: string
}

// This function now supports two calling conventions:
//  1) Static list: addDropdown(label, query, items[])
//  2) Remote list: addDropdown(label, query, storageKey, csvUrl)
export default async function addDropdown(
  label: string,
  queryParameter: string,
  itemsOrStorageKey: DropdownItem[] | string,
  csvUrl?: string,
  pageType?: 'musicGenres' | 'filmGenres' | 'descriptors',
): Promise<void> {
  const table = await waitForElement('.mbgen')
  const container = document.createElement('div')
  container.id = 'brym-vote-history-dropdown-container'
  container.style.display = 'flex'
  container.style.alignItems = 'center'
  container.style.marginBottom = '1em'
  table.before(container)

  let initialItems: DropdownItem[] = []
  let storageKey: string | undefined
  let remoteUrl: string | undefined
  let enableRefresh = false

  if (Array.isArray(itemsOrStorageKey)) {
    // Static list case.
    initialItems = itemsOrStorageKey
  } else {
    // Remote list case.
    storageKey = itemsOrStorageKey
    remoteUrl = csvUrl
    enableRefresh = true
    if (!remoteUrl) throw new Error('csvUrl must be provided for remote dropdowns')

    initialItems = await RemoteData.getOrFetchGenres(storageKey, remoteUrl)
  }

  render(
    <Dropdown
      label={label}
      queryParameter={queryParameter}
      initialItems={initialItems}
      enableRefresh={enableRefresh}
      storageKey={storageKey}
      csvUrl={remoteUrl}
      pageType={pageType}
    />,
    container,
  )
}

interface DropdownProps {
  label: string
  queryParameter: string
  initialItems: DropdownItem[]
  enableRefresh: boolean
  storageKey?: string
  csvUrl?: string
  pageType?: 'musicGenres' | 'filmGenres' | 'descriptors'
}

const pageLinkConfig = [
  {
    type: 'musicGenres',
    path: '/rgenre/vote_history',
    title: 'Music Genres',
    icon: '🎵',
  },
  {
    type: 'filmGenres',
    path: '/rgenre/film_vote_history',
    title: 'Film Genres',
    icon: '🎬',
  },
  {
    type: 'descriptors',
    path: '/rdescriptor/vote_history',
    title: 'Descriptors',
    icon: '🏷️',
  },
] as const

function Dropdown({
  label,
  queryParameter,
  initialItems,
  enableRefresh,
  storageKey,
  csvUrl,
  pageType,
}: DropdownProps) {
  const parameters = new URLSearchParams(window.location.search)
  const [items, setItems] = useState<DropdownItem[]>(initialItems)
  const [isRefreshing, setIsRefreshing] = useState(false)

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

  const handleRefresh = useCallback(async (e: MouseEvent) => {
    if (e.ctrlKey && csvUrl) {
      window.open(csvUrl.replace('&output=csv', ''), '_blank')
      return
    }

    if (!enableRefresh || !storageKey || !csvUrl) return
    setIsRefreshing(true)
    try {
      const freshItems = await RemoteData.forceFetchAndCacheGenres(
        storageKey,
        csvUrl,
      )
      setItems(freshItems)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('BetterRYM: Failed to refresh dropdown items:', error)
    } finally {
      setIsRefreshing(false)
    }
  }, [enableRefresh, storageKey, csvUrl])

  const buildLink = (path: string): string => {
    const p = new URLSearchParams(window.location.search)
    p.set('start', '0')
    p.delete('genre')
    p.delete('descriptor')
    return path + '?' + p.toString()
  }

  const navLinks = pageLinkConfig
    .filter(page => page.type !== pageType)
    .map(page => ({
      href: buildLink(page.path),
      title: `${pageType === 'descriptors' ? '' : 'Go to '}${page.title}`,
      icon: page.icon,
    }))

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <label
        htmlFor={`brym-vote-history-${label}`}
        style={{ width: '1.2em', textAlign: 'center', fontSize: '1.4em', lineHeight: 1, marginRight: '6px' }}
        title={
          pageType === 'musicGenres'
            ? 'Music Genres list'
            : pageType === 'filmGenres'
            ? 'Film Genres list'
            : 'Descriptors list'
        }
      >
        {pageType === 'musicGenres' && '🎵'}
        {pageType === 'filmGenres' && '🎬'}
        {pageType === 'descriptors' && '🏷️'}
      </label>
      <select
        id={`brym-vote-history-${label}`}
        style={{ marginLeft: '4px' }}
        onChange={handleChange}
        value={parameters.get(queryParameter) ?? ''}
      >
        <option value=''>all</option>
        {items.map((item: DropdownItem) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
      {enableRefresh && (
        <button
          title='Refresh list from source (Ctrl+click to open sheet)'
          onClick={handleRefresh}
          disabled={isRefreshing}
          style={{
            marginLeft: '8px',
            padding: '2px 6px',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            fontSize: '1.2em',
            lineHeight: 1,
          }}
        >
          🔄
        </button>
      )}

      {navLinks.length > 0 && (
        <>
          <span style={{ marginLeft: '8px', opacity: 0.5 }}>|</span>
          <span style={{ marginLeft: '6px', marginRight: '4px', fontSize: '0.9em', opacity: 0.8 }}>
            Go to:
          </span>
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              title={link.title}
              style={{ marginLeft: '6px', fontSize: '1.2em', textDecoration: 'none' }}
            >
              {link.icon}
            </a>
          ))}
        </>
      )}
    </div>
  )
}
