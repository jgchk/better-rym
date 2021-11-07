import { FunctionComponent, h } from 'preact'
import { useCallback, useEffect, useState } from 'preact/hooks'

import { equals, uniqueBy } from '../../common/utils/array'
import { clsx } from '../../common/utils/clsx'
import { pipe } from '../../common/utils/pipe'
import { ifDefined, isDefined } from '../../common/utils/types'
import classes from '../styles/unknown-artist.module.css'
import { selectShortcut } from '../utils/page-functions'

type Artist = {
  id: number
  name: string
}

const UNKNOWN_ARTIST: Artist = { id: 250_714, name: '[unknown artist]' }

export const Credits: FunctionComponent = () => {
  const [filedUnderArtists, setFiledUnderArtists] = useState<Artist[]>([
    UNKNOWN_ARTIST,
  ])
  useEffect(() => {
    console.log('OBSERVE')
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
        (artists) => [UNKNOWN_ARTIST, ...artists],
        uniqueBy((artist) => artist.id)
      )

      console.log(
        artists,
        filedUnderArtists,
        equals(artists, filedUnderArtists)
      )
      if (!equals(artists, filedUnderArtists)) {
        setFiledUnderArtists(artists)
      }
    })

    observer.observe(document, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [filedUnderArtists])
  useEffect(() => console.log(filedUnderArtists), [filedUnderArtists])

  const handleClick = useCallback(
    (artist: Artist) => selectShortcut('a', artist.id, artist.name, 'credits'),
    []
  )

  return (
    <div className={classes.container}>
      {filedUnderArtists.map((artist) => (
        <input
          key={artist.id}
          type='button'
          className={clsx('btn', classes['small-button'])}
          value={`+ ${artist.name}`}
          onClick={() => handleClick(artist)}
        />
      ))}
    </div>
  )
}
