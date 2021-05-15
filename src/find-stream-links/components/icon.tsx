import { FunctionComponent, h } from 'preact'
import { useMemo } from 'preact/hooks'
import { Failed } from '../../common/components/failed'
import { Loader } from '../../common/components/loader'
import { Service } from '../../common/services/types'
import { clsx } from '../../common/utils/clsx'
import { fold, isFailed, isLoading } from '../../common/utils/one-shot'
import { pipe } from '../../common/utils/pipe'
import { isDefined } from '../../common/utils/types'
import css from '../styles/icon.module.css'
import { ServiceData, ServiceState } from './service-link'

export const Icon: FunctionComponent<{
  service: Service
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
      {service.icon({ className: css.icon })}
      {isLoading(state) && <Loader className={css.status} />}
      {isFailed(state) && <Failed error={state.error} className={css.status} />}
    </div>
  )
}
