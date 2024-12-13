import { render } from 'preact'
import { useCallback, useState } from 'preact/hooks'

import { ServiceLinkForm } from '~/common/components/service-link-form'
import { useReleaseInfo } from '~/common/hooks/use-release-info'
import { RESOLVABLES } from '~/common/services'
import type { Resolvable, ResolveData, Service } from '~/common/services/types'
import { waitForElement } from '~/common/utils/dom'
import { download } from '~/common/utils/download'
import { isComplete } from '~/common/utils/one-shot'

import type { CapitalizationType } from '../utils/capitalization'
import { CAPITALIZATION_TYPES } from '../utils/capitalization'
import { fill } from '../utils/fillers'
import type { ReleaseOptions } from '../utils/types'

export default async function injectImportControls() {
  const siblingElement = await waitForElement('.submit_step_header')
  const app = document.createElement('div')
  app.id = 'better-rym'
  siblingElement.before(app)
  render(<Import />, app)
}

function Import() {
  const { info, fetchInfo } = useReleaseInfo()
  const [formOptions, setFormOptions] = useState(DEFAULT_FORM_OPTIONS)

  const fetchInfoOuter = useCallback(
    async (url: string, service: Service & Resolvable) => {
      const info = await fetchInfo(url, service)
      if (isComplete(info)) {
        void fill(info.data, formOptions)

        // emit import event
        const importEvent = new CustomEvent<ResolveData>('importEvent', {
          detail: info.data,
        })
        document.dispatchEvent(importEvent)

        if (formOptions.downloadArt && info.data.coverArt) {
          const filename = getFilename(info.data)
          await download(info.data.coverArt.map((url) => ({ url, filename })))
        }
      }
    },
    [fetchInfo, formOptions],
  )

  return (
    <>
      <div className='submit_step_header'>
        Step 0: <span className='submit_step_header_title'>Import</span>
      </div>
      <div className={'submit_step_box'}>
        <ServiceLinkForm
          services={RESOLVABLES}
          submitText='Import'
          data={info}
          onSubmit={fetchInfoOuter}
        >
          <ImportOptionsForm onOptionsUpdate={setFormOptions} />
        </ServiceLinkForm>
      </div>
    </>
  )
}

function getFilename({ title, artists }: ResolveData) {
  let filename = ''
  if (artists && artists.length > 0) filename += artists.join(', ')
  if (title) {
    if (artists && artists.length > 0) filename += ' - '
    filename += title
  }
  return filename.length === 0 ? 'cover' : filename
}

function ImportOptionsForm({
  onOptionsUpdate,
}: {
  onOptionsUpdate?: (options: ImportOptions) => void
}) {
  const [options, setOptions_] = useState(DEFAULT_FORM_OPTIONS)

  const setOptions = (newOptions: ImportOptions) => {
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

type ImportOptions = ReleaseOptions & { downloadArt: boolean }

const CAPITALIZATION_TYPE_MAP: Record<CapitalizationType, string> = {
  'title-case': 'Title Case',
  'sentence-case': 'Sentence case',
  'as-is': 'Keep as-is',
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

const DEFAULT_FORM_OPTIONS: ImportOptions = {
  fillFields: Object.fromEntries(
    Object.keys(FIELDS_MAP).map((field) => [field, field === 'artists' ? false : true]),
  ) as ReleaseOptions['fillFields'],
  capitalization: 'title-case',
  downloadArt: false,
};
