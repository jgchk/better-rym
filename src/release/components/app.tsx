import { FunctionComponent, h } from 'preact'
import { SERVICES } from '../../common/services'
import { usePageData } from '../hooks/use-page-data'
import './app.css'
import styles from './app.module.css'
import { ServiceLink } from './service-link'

export const App: FunctionComponent = () => {
  const pageData = usePageData()

  return (
    <div className={styles.app}>
      {SERVICES.map((service) => (
        <ServiceLink key={service} service={service} pageData={pageData} />
      ))}
    </div>
  )
}
