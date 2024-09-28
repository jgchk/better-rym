import { FunctionComponent, h, JSX } from 'preact'

import CheckIcon from '../icons/check'

export const Complete: FunctionComponent<
  Omit<JSX.SVGAttributes<SVGSVGElement>, 'className'> & { className?: string }
> = ({ className, ...properties }) => (
  <CheckIcon
    className={className}
    style={{
      color: 'var(--gen-bg-darkgreen)',
    }}
    {...properties}
  />
)
