import { pipe } from 'fp-ts/function'
import { FunctionComponent, h } from 'preact'
import { useCallback, useEffect, useState } from 'preact/hooks'
import { ServiceId, search } from '../../common/services'
import { parseError } from '../../common/utils/error'
import * as oneShot from '../../common/utils/one-shot'
import { isDefined } from '../../common/utils/types'
import { PageDataState } from '../hooks/use-page-data'
import { Metadata } from '../utils/page-data'
import { Icon } from './icon'

type ServiceState = oneShot.OneShot<{
  searched: boolean
  link: string | undefined
}>

export const ServiceLink: FunctionComponent<{
  serviceId: ServiceId
  pageData: PageDataState
}> = ({ serviceId: service, pageData }) => {
  const [state, setState] = useState<ServiceState>(oneShot.initial)

  const fetch = useCallback(
    async (metadata: Metadata) => {
      setState(oneShot.loading)

      const nextState = await search(metadata, service)
        .then((link) => oneShot.complete({ searched: true, link }))
        .catch((error) => oneShot.failed(parseError(error)))

      setState(nextState)
    },
    [service]
  )

  useEffect(() => {
    if (oneShot.isComplete(pageData)) {
      const link = pageData.data.links[service]
      if (isDefined(link)) {
        setState(oneShot.complete({ searched: false, link }))
      } else {
        void fetch(pageData.data.metadata)
      }
    }
  }, [fetch, pageData, service])

  return pipe(
    state,
    oneShot.fold(
      () => <Icon service={service} state='initial' />,
      () => <Icon service={service} state='loading' />,
      () => <Icon service={service} state='failed' />,
      ({ searched, link }) =>
        isDefined(link) ? (
          <a href={link} target='_blank' rel='noreferrer'>
            <Icon
              service={service}
              state={searched ? 'searched' : 'existing'}
            />
          </a>
        ) : (
          <Icon service={service} state='initial' />
        )
    )
  )
}
