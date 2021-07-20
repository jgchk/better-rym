import { VNode, h } from 'preact'
import { Service } from '../services/types'
import styles from '../styles/service-selector.module.css'
import { clsx } from '../utils/clsx'

type ServiceSelectorProperties<S extends Service> = {
  services: S[]
  selected: S | undefined
  onSelect: (service: S) => void
}

export const ServiceSelector = <S extends Service>({
  services,
  selected,
  onSelect,
}: ServiceSelectorProperties<S>): VNode => (
  <div className={styles.icons}>
    {services.map((service) => (
      <button
        key={service.id}
        type='button'
        onClick={() => onSelect(service)}
        className={clsx(
          styles.icon,
          service.id === selected?.id && styles.selected
        )}
      >
        {service.icon({ title: service.name })}
      </button>
    ))}
  </div>
)
