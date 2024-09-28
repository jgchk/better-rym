import { h, VNode } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import { Service } from '../services/types'
import { fold, isFailed, OneShot } from '../utils/one-shot'
import { pipe } from '../utils/pipe'
import { Complete } from './complete'
import { Failed } from './failed'
import { Loader } from './loader'
import {
  CAPITALIZATION_TYPES,
  CapitalizationType,
} from '~/modules/release-submission/utils/capitalization'
import { getMatchingService } from '../services'
import { ServiceSelector } from './service-selector'
import { ReleaseOptions } from '~/modules/release-submission/utils/types'

export function StatusForm<E extends Error, T, S extends Service>({
  data,
  services,
  onSubmit,
  submitText = 'Submit',
  children,
}: {
  data: OneShot<E, T>
  services: S[]
  onSubmit: (url: string, service: S) => void | Promise<void>
  submitText?: string
  children?: VNode
}): VNode {
  useEffect(() => {
    if (isFailed(data)) {
      console.error(data.error)
    }
  }, [data])

  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        alignItems: 'center',
      }}
    >
      <Form
        services={services}
        submitText={submitText}
        onSubmit={(url, service) => void onSubmit(url, service)}
      >
        {children}
      </Form>
      {pipe(
        data,
        fold(
          () => null,
          () => <Loader />,
          (error) => <Failed error={error} />,
          () => <Complete />,
        ),
      )}
    </div>
  )
}

function Form<S extends Service>({
  services,
  submitText,
  onSubmit,
  children,
}: {
  services: S[]
  submitText: string
  onSubmit: (url: string, service: S) => void
  children?: VNode
}): VNode {
  const [url, setUrl] = useState('')
  const [selectedService, setSelectedService] = useState<S | undefined>(
    undefined,
  )
  const [showMissingServiceError, setShowMissingServiceError] = useState(false)

  useEffect(() => {
    const service = getMatchingService(services)(url)
    if (service !== undefined) {
      setSelectedService(service)
    }
  }, [services, url])

  useEffect(() => {
    if (selectedService !== undefined) setShowMissingServiceError(false)
  }, [selectedService])

  return (
    <form
      style={{
        display: 'flex',
        gap: 8,
      }}
      onSubmit={(event) => {
        event.preventDefault()
        if (selectedService !== undefined) {
          onSubmit(url, selectedService)
        } else {
          setShowMissingServiceError(true)
        }
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          alignItems: 'center',
          width: 384,
        }}
      >
        <input
          type='url'
          value={url}
          required
          onInput={(event) => setUrl((event.target as HTMLInputElement).value)}
          style={{ width: '100%' }}
        />
        <ServiceSelector
          services={services}
          selected={selectedService}
          onSelect={setSelectedService}
        />
        {showMissingServiceError && (
          <div style={{ color: 'var(--gen-text-red)' }}>
            Select an import source
          </div>
        )}
        {children}
      </div>
      <input
        type='submit'
        value={submitText}
        style={{
          cursor: 'pointer',
        }}
      />
    </form>
  )
}

export function FormOptionsForm({
  onOptionsUpdate,
}: {
  onOptionsUpdate?: (options: ReleaseOptions) => void
}) {
  const [options, setOptions_] = useState(DEFAULT_FORM_OPTIONS)

  const setOptions = (newOptions: ReleaseOptions) => {
    setOptions_(newOptions)
    if (onOptionsUpdate !== undefined) {
      onOptionsUpdate(newOptions)
    }
  }

  return (
    <>
      <label htmlFor='brym-capitalize'>
        Capitalization:&nbsp;
        <select
          value={options.capitalization}
          onChange={(event) =>
            setOptions({
              ...options,
              capitalization: (event.target as HTMLSelectElement)
                .value as CapitalizationType,
            })
          }
        >
          {CAPITALIZATION_TYPES.map((capType) => (
            <option value={capType} key={capType}>
              {CAPITALIZATION_TYPE_MAP[capType]}
            </option>
          ))}
        </select>
      </label>
      <details>
        <summary
          style={{
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          Advanced Options
        </summary>
        <div
          id='brym-release-options'
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            alignItems: 'center',
            width: 384,
            marginTop: '0.5em',
          }}
        >
          <hr style='width:100%;margin-bottom:0.5em' />
          <label htmlFor='brym-downloadart'>
            Download Cover Art:&nbsp;
            <input
              type='checkbox'
              checked={options.downloadArt}
              onChange={(event) =>
                setOptions({
                  ...options,
                  downloadArt: (event.target as HTMLInputElement).checked,
                })
              }
            />
          </label>
          <hr style='width:100%;margin-bottom:0.5em' />
          {(Object.keys(FIELDS_MAP) as FillField[]).map((field) => (
            <label key={field}>
              {FIELDS_MAP[field]}:&nbsp;
              <input
                id={`brym-${field}`}
                type='checkbox'
                checked={options.fillFields[field]}
                onChange={(event) => {
                  const field = event.currentTarget.id.slice(5) as FillField
                  const value = event.currentTarget.checked

                  setOptions({
                    ...options,
                    fillFields: {
                      ...options.fillFields,
                      [field]: value,
                    },
                  })
                }}
              />
            </label>
          ))}
        </div>
      </details>
    </>
  )
}

type FillField = keyof ReleaseOptions['fillFields']

const FIELDS_MAP: Record<FillField, string> = {
  artists: 'Artists',
  type: 'Release Type',
  date: 'Release Date',
  title: 'Title',
  format: 'Issued Format',
  discSize: 'Disc Size',
  label: 'Label',
  attributes: 'Issue Attributes',
  tracks: 'Tracklist',
}

const CAPITALIZATION_TYPE_MAP: Record<CapitalizationType, string> = {
  'title-case': 'Title Case',
  'sentence-case': 'Sentence case',
  'as-is': 'Keep as-is',
}

export const DEFAULT_FORM_OPTIONS: ReleaseOptions = {
  fillFields: Object.fromEntries(
    Object.keys(FIELDS_MAP).map((field) => [field, true]),
  ) as ReleaseOptions['fillFields'],
  capitalization: 'title-case',
  downloadArt: false,
}
