import { h } from 'preact'

import { FilterButton } from './filter-button'

export function FilterButtons({
  showReleaseTypes,
}: {
  showReleaseTypes: boolean
}) {
  return (
    <div
      style={{
        lineHeight: '2.5em',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        columnGap: '6px',
      }}
    >
      <div>Status:</div>
      <div>
        {STATUS.map(([name, modifier]) => (
          <FilterButton key={name} name={name} base='o' modifier={modifier} />
        ))}
      </div>

      <div>Rating:</div>
      <div>
        {RATINGS.map(([name, modifier]) => (
          <FilterButton key={name} name={name} base='r' modifier={modifier} />
        ))}
      </div>

      {showReleaseTypes && (
        <>
          <div>Type:</div>
          <div>
            {RELEASE_TYPES.map(([name, modifier]) => (
              <FilterButton
                key={name}
                name={name}
                base='typ'
                modifier={modifier}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const RELEASE_TYPES = [
  ['Albums', 'typs'],
  ['EPs', 'type'],
  ['Singles', 'typi'],
  ['Music Videos', 'typo'],
  ['Mixtapes', 'typm'],
  ['DJ Mixes', 'typj'],
  ['Compilations', 'typc'],
  ['Videos', 'typd'],
  ['Bootlegs', 'typb'],
  ['Additional Releases', 'typx'],
] as const

const RATINGS = [
  ['0.5', 'r0.5'],
  ['1.0', 'r1.0'],
  ['1.5', 'r1.5'],
  ['2.0', 'r2.0'],
  ['2.5', 'r2.5'],
  ['3.0', 'r3.0'],
  ['3.5', 'r3.5'],
  ['4.0', 'r4.0'],
  ['4.5', 'r4.5'],
  ['5.0', 'r5.0'],
  ['Unrated', 'r0.0'],
  ['Rated', 'r0.5-5.0'],
] as const

const STATUS = [
  ['Owned', 'oo'],
  ['Used to Own', 'ou'],
  ['Wishlist', 'ow'],
  ['Not Owned', 'on'],
] as const
