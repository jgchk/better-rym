import { Component, Match, Switch, createEffect, createState } from 'solid-js'
import { Service, search } from '../../common/services'
import { parseError } from '../../common/utils/error'
import {
  OneShot,
  asComplete,
  asFailed,
  asInitial,
  asLoading,
  complete,
  failed,
  initial,
  isComplete,
  loading,
} from '../../common/utils/one-shot'
import { asDefined, isDefined, isUndefined } from '../../common/utils/types'
import { PageDataState } from '../hooks/use-metadata'
import { Metadata } from '../utils/page-data'
import { Icon } from './icon'

type ServiceState = OneShot<{ searched: boolean; link: string | undefined }>

export const ServiceLink: Component<{
  service: Service
  pageData: PageDataState
}> = ({ service, pageData }) => {
  const [state, setState] = createState<ServiceState>(initial())

  const fetch = async (metadata: Metadata) => {
    setState(loading())

    const nextState = await search(metadata, service)
      .then((link) => complete({ searched: true, link }))
      .catch((error) => failed(parseError(error)))

    setState(nextState)
  }

  createEffect(() => {
    if (isComplete(pageData)) {
      const link = pageData.data.links[service]
      if (isDefined(link)) {
        setState(complete({ searched: false, link }))
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
