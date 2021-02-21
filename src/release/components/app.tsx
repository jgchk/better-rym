import { FunctionComponent, h } from 'preact'
import { SERVICE_IDS } from '../../common/services'
import { usePageData } from '../hooks/use-page-data'
import './app.css'
import styles from './app.module.css'
import { ServiceLink } from './service-link'

export const App: FunctionComponent = () => {
  const pageData = usePageData()

  return (
    <div className={styles.app}>
      {SERVICE_IDS.map((service) => (
        <ServiceLink key={service} service={service} pageData={pageData} />
      ))}
    </div>
  )
}
