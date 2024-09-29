import pkg from '../package.json'

const sharedManifest = {
  content_scripts: [
    {
      js: ['src/modules/cover-art/main.ts'],
      matches: ['*://*.rateyourmusic.com/images/upload*'],
      run_at: 'document_start',
    },
    {
      js: ['src/modules/release-submission/main.ts'],
      matches: ['*://*.rateyourmusic.com/releases/ac*'],
      run_at: 'document_start',
    },
    {
      js: ['src/modules/search-bar/main.ts'],
      matches: ['*://*.rateyourmusic.com/*'],
      run_at: 'document_start',
    },
    {
      js: ['src/modules/stream-link-missing/main.ts'],
      matches: ['*://*.rateyourmusic.com/misc/media_link_you_know*'],
      run_at: 'document_start',
    },
    {
      js: ['src/modules/stream-link-submission/main.ts'],
      matches: ['*://*.rateyourmusic.com/submit_media_link*'],
      run_at: 'document_start',
    },
    {
      js: ['src/modules/stream-links/main.ts'],
      matches: ['*://*.rateyourmusic.com/release/*'],
      run_at: 'document_start',
    },
    {
      js: ['src/modules/user-collection/main.ts'],
      matches: [
        '*://*.rateyourmusic.com/collection*',
        '*://*.rateyourmusic.com/film_collection*',
      ],
      run_at: 'document_start',
    },
    {
      js: ['src/modules/user-page/main.ts'],
      matches: ['*://*.rateyourmusic.com/~*'],
      run_at: 'document_start',
    },
    {
      js: ['src/modules/vote-history/genres.ts'],
      matches: ['*://*.rateyourmusic.com/rgenre/vote_history*'],
      run_at: 'document_start',
    },
    {
      js: ['src/modules/vote-history/descriptors.ts'],
      matches: ['*://*.rateyourmusic.com/rdescriptor/vote_history*'],
      run_at: 'document_start',
    },
  ],
  icons: {
    '16': 'icons/sonemic-16.png',
    '48': 'icons/sonemic-48.png',
    '128': 'icons/sonemic-128.png',
  },
  permissions: [
    'storage',
    'downloads',
    'tabs',
    'scripting',
    'activeTab',
  ] as chrome.runtime.ManifestPermissions[],
} satisfies Partial<chrome.runtime.ManifestBase>

const browserAction = {
  default_title: 'BetterRYM',
}

const ManifestV2 = {
  ...sharedManifest,
  background: {
    scripts: ['src/modules/background/index.ts'],
  },
  browser_action: browserAction,
  permissions: [...sharedManifest.permissions, '*://*/*'],
}

const ManifestV3 = {
  ...sharedManifest,
  action: browserAction,
  background: {
    service_worker: 'src/modules/background/index.ts',
  },
  host_permissions: ['*://*/*'],
}

export function getManifest(
  manifestVersion: number,
): chrome.runtime.ManifestV2 | chrome.runtime.ManifestV3 {
  const manifest = {
    author: pkg.author,
    description: pkg.description,
    name: pkg.displayName ?? pkg.name,
    version: pkg.version,
  }

  if (manifestVersion === 2) {
    return {
      ...manifest,
      ...ManifestV2,
      manifest_version: manifestVersion,
    }
  }

  if (manifestVersion === 3) {
    return {
      ...manifest,
      ...ManifestV3,
      manifest_version: manifestVersion,
    }
  }

  throw new Error(
    `Missing manifest definition for manifestVersion ${manifestVersion}`,
  )
}
