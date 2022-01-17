import '../styles/app.css'

import { FunctionComponent, h } from 'preact'

import { SEARCHABLES } from '../../common/services'
import { usePageData } from '../hooks/use-page-data'
import styles from '../styles/app.module.css'
import { ServiceLink } from './service-link'
import { SingleStreamingButtonWarning } from './single-streaming-button-warning'

export const App: FunctionComponent = () => {
  const pageData = usePageData()

  return (
    <div className={styles.container}>
      {SEARCHABLES.map((service) => (
        <ServiceLink key={service.id} service={service} pageData={pageData} />
      ))}
      <SingleStreamingButtonWarning />
    </div>
  )
}
