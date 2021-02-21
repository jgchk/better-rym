import { FunctionComponent, h } from 'preact'
import { SERVICE_IDS } from '../../common/services'
import { usePageData } from '../hooks/use-page-data'
import '../styles/app.css'
import styles from '../styles/app.module.css'
import { ServiceLink } from './service-link'

export const App: FunctionComponent = () => {
  const pageData = usePageData()

  return (
    <div className={styles.app}>
      {SERVICE_IDS.map((id) => (
        <ServiceLink key={id} serviceId={id} pageData={pageData} />
      ))}
    </div>
  )
}
