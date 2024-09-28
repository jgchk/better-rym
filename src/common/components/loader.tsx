import { FunctionComponent, h, JSX } from 'preact'

import LoaderIcon from '../icons/loader'
import styles from '../styles/loader.module.css'
import { clsx } from '../utils/clsx'

export const Loader: FunctionComponent<
  Omit<JSX.SVGAttributes<SVGSVGElement>, 'className'> & { className?: string }
> = ({ className, ...properties }) => (
  <LoaderIcon className={clsx(styles.loader, className)} {...properties} />
)
