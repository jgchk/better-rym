import { FunctionComponent, h, JSX } from 'preact'

import LoaderIcon from '../icons/loader'
import styles from '../styles/loader.module.css'
import { clsx } from '../utils/clsx'

export const Loader: FunctionComponent<JSX.SVGAttributes<SVGSVGElement>> = ({
  className,
  ...properties
}) => <LoaderIcon className={clsx(styles.loader, className)} {...properties} />
