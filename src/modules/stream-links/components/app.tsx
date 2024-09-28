import { FunctionComponent, h } from 'preact'

import { SEARCHABLES } from '../../../common/services'
import { usePageData } from '../hooks/use-page-data'
import { ServiceLink } from './service-link'
import { useEffect } from 'preact/hooks'

export const App: FunctionComponent = () => {
  const pageData = usePageData()

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      #media_link_button_container_top {
        display: none;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        gap: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '1.5em',
      }}
    >
      {SEARCHABLES.map((service) => (
        <ServiceLink key={service.id} service={service} pageData={pageData} />
      ))}
    </div>
  )
}
