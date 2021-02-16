import { Component, Match, Switch, createEffect, createState } from 'solid-js'
import { Service, search } from '../../common/services'
import { parseError } from '../../common/utils/error'
import {
  OneShot,
  asComplete,
  asFailed,
  asInitial,
  asLoading,
} from '../../common/utils/one-shot'
import { asDefined, isUndefined } from '../../common/utils/types'
import { PageDataState } from '../hooks/use-metadata'
import { Metadata } from '../utils/page-data'
import { Icon } from './icon'

type ServiceState = OneShot<{ searched: boolean; link: string | undefined }>

export const ServiceLink: Component<{
  service: Service
  pageData: PageDataState
}> = ({ service, pageData }) => {
  const [state, setState] = createState<ServiceState>({ type: 'initial' })

  const fetch = async (metadata: Metadata) => {
    setState({ type: 'loading' })

    const nextState = await search(metadata, service)
      .then(
        (link) =>
          ({
            type: 'complete',
            data: { searched: true, link },
          } as const)
      )
      .catch(
        (error) =>
          ({
            type: 'failed',
            error: parseError(error),
          } as const)
      )

    setState(nextState)
  }

  createEffect(() => {
    if (pageData.type === 'complete') {
      const link = pageData.data.links[service]
      if (link) {
        setState({ type: 'complete', data: { searched: false, link } })
      } else {
        void fetch(pageData.data.metadata)
      }
    }
  })

  return (
    <Switch>
      <Match when={asInitial(state)}>
        <Icon service={service} state='initial' />
      </Match>
      <Match when={asLoading(state)}>
        <Icon service={service} state='loading' />
      </Match>
      <Match when={asComplete(state)}>
        {({ data: { searched, link } }) => (
          <Switch>
            <Match when={asDefined(link)}>
              {(link) => (
                <a href={link} target='_blank' rel='noreferrer'>
                  <Icon
                    service={service}
                    state={searched ? 'searched' : 'existing'}
                  />
                </a>
              )}
            </Match>
            <Match when={isUndefined(link)}>
              <Icon service={service} state='initial' />
            </Match>
          </Switch>
        )}
      </Match>
      <Match when={asFailed(state)}>
        <Icon service={service} state='failed' />
      </Match>
    </Switch>
  )
}
