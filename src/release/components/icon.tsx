import clsx from 'clsx'
import { FunctionComponent, h } from 'preact'
import LoadingIcon from '../../../res/loader.svg'
import XIcon from '../../../res/x.svg'
import { SERVICES, ServiceId } from '../../common/services'
import css from './icon.module.css'

export const Icon: FunctionComponent<{
  service: ServiceId
  state: 'initial' | 'loading' | 'failed' | 'searched' | 'existing'
}> = ({ service, state }) => (
  <div className={clsx(css.container, css[state])}>
    {SERVICES[service].icon({ className: css.icon })}
    {state === 'loading' && <LoadingIcon className={css.status} />}
    {state === 'failed' && <XIcon className={css.status} />}
  </div>
)
