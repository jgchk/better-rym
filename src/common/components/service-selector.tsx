import clsx from 'clsx'
import { FunctionComponent, h } from 'preact'
import { SERVICES, SERVICE_IDS, ServiceId } from '../services'
import styles from '../styles/service-selector.module.css'

export const ServiceSelector: FunctionComponent<{
  serviceId: ServiceId | undefined
  onSelect: (id: ServiceId) => void
}> = ({ serviceId, onSelect }) => (
  <div className={styles.icons}>
    {SERVICE_IDS.map((id) => SERVICES[id]).map((service) => (
      <button
        key={service.id}
        type='button'
        onClick={() => onSelect(service.id)}
        className={clsx(
          styles.icon,
          service.id === serviceId && styles.selected
        )}
      >
        {service.icon({})}
      </button>
    ))}
  </div>
)
