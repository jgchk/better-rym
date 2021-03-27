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
  ['Bootlegs', 'typb'],
  ['Everything', ''],
] as const

export const App: FunctionComponent = () => {
  return (
    <div>
      {RELEASE_TYPES.map(([name, modifier]) => (
        <Button key={name} name={name} modifier={modifier} />
      ))}
    </div>
  )
}
