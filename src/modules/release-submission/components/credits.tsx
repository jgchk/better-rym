import { FunctionComponent, h } from 'preact'
import { useCallback, useEffect, useState } from 'preact/hooks'

import { equals, uniqueBy } from '../../../common/utils/array'
import { clsx } from '../../../common/utils/clsx'
import { pipe } from '../../../common/utils/pipe'
import { ifDefined, isDefined } from '../../../common/utils/types'
import classes from '../styles/buttons.module.css'
import { selectShortcut } from '../utils/page-functions'

type Artist = {
  id: number
  name: string
}

export const Credits: FunctionComponent = () => {
  const [filedUnderArtists, setFiledUnderArtists] = useState<Artist[]>([])
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
    </div>
  )
}
