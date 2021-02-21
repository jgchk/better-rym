import clsx from 'clsx'
import { FunctionComponent, h } from 'preact'
import LoadingIcon from '../../../res/loader.svg'
import XIcon from '../../../res/x.svg'
import { ICONS, Service } from '../../common/services'
import css from './icon.module.css'

export const Icon: FunctionComponent<{
  service: Service
  state: 'initial' | 'loading' | 'failed' | 'searched' | 'existing'
}> = ({ service, state }) => (
  <div className={clsx(css.container, css[state])}>
    {ICONS[service]({ className: css.icon })}
    {state === 'loading' && <LoadingIcon className={css.status} />}
    {state === 'failed' && <XIcon className={css.status} />}
  </div>
)
