import { FeatureIds } from './options/components/options'
import { getBrowserOption } from './options/utils/browser-options'

if (location.pathname.startsWith('/release/')) {
  void getBrowserOption(FeatureIds.StreamLinkAutodiscover, true).then(
    (enabled) => {
      if (enabled) import('./find-stream-links')
    }
  )
} else if (location.pathname.startsWith('/releases/ac')) {
  void getBrowserOption(FeatureIds.ReleaseSubmissionAutofill, true).then(
    (enabled) => {
      if (enabled) void import('./release-submission')
    }
  )
} else if (location.pathname.startsWith('/images/upload')) {
  void getBrowserOption(FeatureIds.CoverArtDownloader, true).then((enabled) => {
    if (enabled) void import('./cover-art')
  })
} else if (location.pathname.startsWith('/submit_media_link')) {
  void getBrowserOption(FeatureIds.StreamLinkEmbedConverter, true).then(
    (enabled) => {
      if (enabled) void import('./submit-stream-links')
    }
  )
} else if (location.pathname.startsWith('/collection')) {
  void getBrowserOption(FeatureIds.CollectionFilters, true).then((enabled) => {
    if (enabled) void import('./filter-collection')
  })
} else if (location.pathname.startsWith('/~')) {
  void getBrowserOption(FeatureIds.ProfileQuickEdit, true).then((enabled) => {
    if (enabled) void import('./user-page')
  })
}

void getBrowserOption(FeatureIds.SearchBarShortcuts, true).then((enabled) => {
  if (enabled) void import('./search-bar')
})
