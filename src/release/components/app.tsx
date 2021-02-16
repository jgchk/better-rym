import { Component, For } from 'solid-js'
import { SERVICES } from '../../common/services'
import { usePageData } from '../hooks/use-metadata'
import css from './app.module.css'
import { ServiceLink } from './service-link'
import './app.css'

export const App: Component = () => {
  const pageData = usePageData()

  return (
    <div className={css.app}>
      <For each={SERVICES}>
        {(service) => <ServiceLink service={service} pageData={pageData} />}
      </For>
    </div>
  )
}
