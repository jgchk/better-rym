import clsx from 'clsx'
import { FunctionComponent, JSX, h } from 'preact'
import Icon from '../../../res/x.svg'
import styles from '../styles/failed.module.css'

export const Failed: FunctionComponent<
  { error: Error } & JSX.SVGAttributes<SVGSVGElement>
> = ({ error, className, ...properties }) => (
  <Icon className={clsx(styles.failed, className)} {...properties} />
)
