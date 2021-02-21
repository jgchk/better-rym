import clsx from 'clsx'
import { pipe } from 'fp-ts/function'
import { FunctionComponent, h } from 'preact'
import { useMemo } from 'preact/hooks'
import { Failed } from '../../common/components/failed'
import { Loader } from '../../common/components/loader'
import { SERVICES, ServiceId } from '../../common/services'
import { fold, isFailed, isLoading } from '../../common/utils/one-shot'
import { isDefined } from '../../common/utils/types'
import css from '../styles/icon.module.css'
import { ServiceData, ServiceState } from './service-link'

export const Icon: FunctionComponent<{
  service: ServiceId
  state: ServiceState
}> = ({ service, state }) => {
  const stateClass = useMemo(
    () =>
      pipe(
        state,
        fold<Error, ServiceData, keyof typeof css>(
          () => 'initial',
          () => 'loading',
          () => 'failed',
          ({ link, searched }) =>
            isDefined(link) ? (searched ? 'searched' : 'existing') : 'initial'
        )
      ),
    [state]
  )

  return (
    <div className={clsx(css.container, css[stateClass])}>
      {SERVICES[service].icon({ className: css.icon })}
      {isLoading(state) && <Loader className={css.status} />}
      {isFailed(state) && <Failed error={state.error} className={css.status} />}
    </div>
  )
}
