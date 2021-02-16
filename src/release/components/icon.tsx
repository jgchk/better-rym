import clsx from 'clsx'
import { Component, Match, Switch } from 'solid-js'
import loadingIcon from '../../../res/loader.svg'
import xIcon from '../../../res/x.svg'
import { ICONS, Service } from '../services'
import css from './icon.module.css'

export const Icon: Component<{
  service: Service
  state: 'initial' | 'loading' | 'failed' | 'searched' | 'existing'
}> = ({ service, state }) => (
  <div className={clsx(css.container, css[state])}>
    <div innerHTML={ICONS[service]} className={css.icon} />
    <Switch>
      <Match when={state === 'loading'}>
        <div innerHTML={loadingIcon} className={css.status} />
      </Match>
      <Match when={state === 'failed'}>
        <div innerHTML={xIcon} className={css.status} />
      </Match>
    </Switch>
  </div>
)
