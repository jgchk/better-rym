import { FunctionComponent, h } from 'preact'
import { Button } from './button'

const RELEASE_TYPES = [
  ['Albums', 'typs'],
  ['EPs', 'type'],
  ['Singles', 'typi'],
  ['Mixtapes', 'typm'],
  ['DJ Mixes', 'typj'],
  ['Compilations', 'typc'],
  ['Videos', 'typd'],
  ['Bootlegs', 'typb']
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
  ['Unrated', 'r0.0']
] as const

const STATUS = [
  ['Owned', 'oo'],
  ['Used to Own', 'ou'],
  ['Wishlist', 'ow'],
  ['Not Owned', 'on']
] as const

export const App: FunctionComponent = () => {
  return (
    <div>
      Status:
      {STATUS.map(([name, modifier]) => (
        <Button key={name} name={name} base='o' modifier={modifier} />
      ))}
      <br/>
      Rating:
      {RATINGS.map(([name, modifier]) => (
        <Button key={name} name={name} base='r' modifier={modifier} />
      ))}
      <br/>
      Type:
      {RELEASE_TYPES.map(([name, modifier]) => (
        <Button key={name} name={name} base='typ' modifier={modifier} />
      ))}
    </div>
  )
}
