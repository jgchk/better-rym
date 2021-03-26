import { FunctionComponent, h } from 'preact'
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks'
import { Searchable, Service } from '../../common/services/types'
import { parseError } from '../../common/utils/error'
import * as oneShot from '../../common/utils/one-shot'
import { isDefined } from '../../common/utils/types'
import { PageDataState } from '../hooks/use-page-data'
import { Metadata } from '../utils/page-data'
import { Icon } from './icon'

export type ServiceData = {
  searched: boolean
  link: string | undefined
}
export type ServiceState = oneShot.OneShot<Error, ServiceData>

export const ServiceLink: FunctionComponent<{
  service: Service & Searchable
  pageData: PageDataState
}> = ({ service, pageData }) => {
  const [state, setState] = useState<ServiceState>(oneShot.initial)

  const fetch = useCallback(
    async (metadata: Metadata) => {
      setState(oneShot.loading)

      const nextState = await service
        .search(metadata)
        .then((link) => oneShot.complete({ searched: true, link }))
        .catch((error) => oneShot.failed(parseError(error)))

      setState(nextState)
    },
    [service]
  )

  useEffect(() => {
    if (oneShot.isComplete(pageData)) {
      const link = pageData.data.links[service.id]
      if (isDefined(link)) {
        setState(oneShot.complete({ searched: false, link }))
      } else {
        void fetch(pageData.data.metadata)
      }
    }
  }, [fetch, pageData, service])

  const icon = useMemo(() => <Icon service={service} state={state} />, [
    service,
    state,
  ])

  // if we have a link available, wrap in an anchor element
  if (oneShot.isComplete(state) && isDefined(state.data.link))
    return (
      <a href={state.data.link} target='_blank' rel='noreferrer'>
        {icon}
      </a>
    )

  return icon
}
