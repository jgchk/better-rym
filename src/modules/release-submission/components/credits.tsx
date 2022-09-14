import { FunctionComponent, h } from 'preact'
import { useCallback, useEffect, useState } from 'preact/hooks'

import { equals, uniqueBy } from '../../../common/utils/array'
import { clsx } from '../../../common/utils/clsx'
import { forceQuerySelector, waitForResult } from '../../../common/utils/dom'
import { pipe } from '../../../common/utils/pipe'
import { ifDefined, isDefined } from '../../../common/utils/types'
import classes from '../styles/buttons.module.css'
import { selectShortcut } from '../utils/page-functions'

type Artist = {
  id: number
  name: string
}

function useSelectedText() {
  const [selectedText, setSelectedText] = useState('')
  const [trackNumber, setTrackNumber] = useState('')
  useEffect(() => {
    function handleChange() {
      setSelectedText(window?.getSelection()?.toString() || '')
      setTrackNumber(
        (
          window?.getSelection()?.anchorNode?.parentElement?.children[1]
            ?.firstChild as HTMLInputElement
        )?.value || ''
      )
    }
    window.addEventListener('select', handleChange)
    handleChange()
    return () => window.removeEventListener('select', handleChange)
  }, [])
  return [selectedText, trackNumber]
}

const fillArtist = async (
  artist: string,
  type: string,
  trackNumber: string
) => {
  // Enter search term
  forceQuerySelector<HTMLInputElement>(document)('#credit_searchterm').value =
    artist

  // Click search button
  forceQuerySelector<HTMLInputElement>(document)(
    '#section_credits .gosearch input[type=button]'
  ).click()

  // Wait for results
  const topResult = await waitForResult(
    forceQuerySelector<HTMLIFrameElement>(document)('#creditlist')
  )

  // Click the top result if there is one
  if (topResult) {
    topResult.click()

    // Set the other meta
    forceQuerySelector<HTMLInputElement>(document)(
      '#creditsx li:last-child .credits_roles input'
    ).value = type
    forceQuerySelector<HTMLInputElement>(document)(
      '#creditsx li:last-child .credits_tracks input'
    ).value = trackNumber
  }
}

export const Credits: FunctionComponent = () => {
  const [filedUnderArtists, setFiledUnderArtists] = useState<Artist[]>([])
  const [selectedText, trackNumber] = useSelectedText()
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (!document.body) return

      const artists: Artist[] = pipe(
        document.querySelectorAll<HTMLAnchorElement>(
          '.sortable_filed_under .filed_under_artist'
        ),
        (nodeList) => [...nodeList],
        (nodes) =>
          nodes
            .map((result) => {
              const artistLink =
                result.querySelector<HTMLAnchorElement>('a.artist')
              if (artistLink === null) return

              const name = artistLink.text

              const id =
                pipe(Number.parseInt(artistLink.title.slice(7, -1)), (n) =>
                  Number.isNaN(n) ? undefined : n
                ) ??
                pipe(
                  result.querySelector<HTMLInputElement>('input')?.value,
                  ifDefined((value) =>
                    pipe(/\[Artist(\d+)]/.exec(value), (match) => match?.[1])
                  ),
                  ifDefined((id) =>
                    pipe(Number.parseInt(id), (n) =>
                      Number.isNaN(n) ? undefined : n
                    )
                  )
                )
              if (id === undefined) return undefined
              return { id, name }
            })
            .filter(isDefined),
        uniqueBy((artist) => artist.id)
      )

      if (!equals(artists, filedUnderArtists)) {
        setFiledUnderArtists(artists)
      }
    })

    observer.observe(document, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [filedUnderArtists])

  const handleClick = useCallback(
    (artist: Artist) => selectShortcut('a', artist.id, artist.name, 'credits'),
    []
  )

  const handleCredit = useCallback(
    (selectedText: string, type: string, trackNumber: string) => {
      void (async () => {
        await fillArtist(selectedText, type, trackNumber)
      })()
    },
    []
  )

  return (
    <div className={classes.container}>
      {filedUnderArtists.map((artist) => (
        <input
          key={artist.id}
          type='button'
          className={clsx('btn', classes.smallButton)}
          value={`+ ${artist.name}`}
          onClick={() => handleClick(artist)}
        />
      ))}
      {selectedText && (
        <input
          key={'featured'}
          type='button'
          className={clsx('btn', classes.smallButton)}
          value={`+ featuring ${selectedText}`}
          onClick={() =>
            handleCredit(selectedText, 'featured', trackNumber || '')
          }
        />
      )}
      {selectedText && (
        <input
          key={'featured'}
          type='button'
          className={clsx('btn', classes.smallButton)}
          value={`+ remixer ${selectedText}`}
          onClick={() =>
            handleCredit(selectedText, 'remixer', trackNumber || '')
          }
        />
      )}
    </div>
  )
}
