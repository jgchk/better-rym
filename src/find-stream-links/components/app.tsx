import { FunctionComponent, h } from 'preact'
import { SEARCHABLES } from '../../common/services'
import { usePageData } from '../hooks/use-page-data'
import '../styles/app.css'
import styles from '../styles/app.module.css'
import { ServiceLink } from './service-link'

export const App: FunctionComponent = () => {
  const pageData = usePageData()

  return (
    <div className={styles.app}>
      {SEARCHABLES.map((service) => (
        <ServiceLink key={service.id} service={service} pageData={pageData} />
      ))}
    </div>
  )
}
