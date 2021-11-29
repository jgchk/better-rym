import { FunctionComponent, h } from 'preact'
import { useCallback, useEffect, useState } from 'preact/hooks'

import classes from '../styles/options.module.css'

const useBrowserOption = <T,>(key: string, defaultValue: T) => {
  const [value, setValue] = useState(defaultValue)

  const fetchSavedValue = useCallback(async () => {
    const savedValues = await browser.storage.sync.get(key)
    if (savedValues[key] !== undefined) setValue(savedValues[key])
  }, [key])

  useEffect(() => void fetchSavedValue(), [fetchSavedValue])

  const setSavedValue = useCallback(
    async (newValue: T) => {
      setValue(value)
      await browser.storage.sync.set({ [key]: newValue })
    },
    [key, value]
  )

  return [value, setSavedValue] as const
}

type Feature = {
  id: string
  label: string
}

export enum FeatureIds {
  StreamLinkAutodiscover = 'options.features.streamLinkAutodiscover',
  StreamLinkEmbedConverter = 'options.features.streamLinkEmbedConverter',
  ReleaseSubmissionAutofill = 'options.features.releaseSubmissionAutofill',
  CoverArtDownloader = 'options.features.coverArtDownloader',
  CollectionFilters = 'options.features.collectionFilters',
  SearchBarShortcuts = 'options.features.searchBarShortcuts',
  ProfileQuickEdit = 'options.features.profileQuickEdit',
}

const features: Feature[] = [
  {
    id: FeatureIds.StreamLinkAutodiscover,
    label: 'Stream Link Autodiscover',
  },
  {
    id: FeatureIds.StreamLinkEmbedConverter,
    label: 'Stream Link Embed Converter',
  },
  {
    id: FeatureIds.ReleaseSubmissionAutofill,
    label: 'Release Submission Autofill',
  },
  { id: FeatureIds.CoverArtDownloader, label: 'Cover Art Downloader' },
  { id: FeatureIds.CollectionFilters, label: 'Collection Filters' },
  { id: FeatureIds.SearchBarShortcuts, label: 'Search Bar Shortcuts' },
  { id: FeatureIds.ProfileQuickEdit, label: 'Profile Quick Edit' },
]

const FeatureToggle: FunctionComponent<Feature> = ({ id, label }) => {
  const [value, setValue] = useBrowserOption(id, true)

  return (
    <div>
      <input
        type='checkbox'
        id={id}
        checked={value}
        onChange={(event) =>
          setValue((event.target as HTMLInputElement).checked)
        }
      />
      <label htmlFor={id}>{label}</label>
    </div>
  )
}

export const Options: FunctionComponent = () => {
  return (
    <form className={classes['options-form']}>
      <fieldset>
        <legend>Features</legend>
        {features.map((feature) => (
          <FeatureToggle key={feature.id} {...feature} />
        ))}
      </fieldset>
    </form>
  )
}
