import { FunctionComponent, h } from 'preact'
import { useCallback } from 'preact/hooks'

import { Failed } from '../../../common/components/failed'
import { Loader } from '../../../common/components/loader'
import { Searchable, Service } from '../../../common/services/types'
import { clsx } from '../../../common/utils/clsx'
import { isComplete, isFailed, isLoading } from '../../../common/utils/one-shot'
import css from '../styles/icon.module.css'
import { ServiceLinkState } from './service-link'

export const Icon: FunctionComponent<{
  service: Service & Searchable
  state: ServiceLinkState
}> = ({ service, state }) => {
  const renderIcon = useCallback(() => {
    if (isComplete(state) && state.data._tag !== 'not-found') {
      return state.data._tag === 'exists'
        ? service.icon({ className: clsx(css.icon, css.full) })
        : service.foundIcon({ className: clsx(css.icon, css.full) })
    } else {
      return service.notFoundIcon({
        className: clsx(css.icon, css.empty),
      })
    }
  }, [service, state])

  return (
    <div className={css.container}>
      {renderIcon()}
      {isLoading(state) && <Loader className={css.status} />}
      {isFailed(state) && <Failed error={state.error} className={css.status} />}
    </div>
  )
}
