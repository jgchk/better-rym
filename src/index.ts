if (location.pathname.startsWith('/release/')) {
  import('./modules/stream-links')
} else if (location.pathname.startsWith('/releases/ac')) {
  import('./modules/release-submission')
} else if (location.pathname.startsWith('/images/upload')) {
  import('./modules/cover-art')
} else if (location.pathname.startsWith('/submit_media_link')) {
  import('./modules/stream-link-submission')
} else if (location.pathname.startsWith('/collection')) {
  import('./modules/user-collection')
} else if (location.pathname.startsWith('/~')) {
  import('./modules/user-page')
} else if (location.pathname.startsWith('/rgenre/vote_history')) {
  import('./modules/vote-history/genres')
} else if (location.pathname.startsWith('/rdescriptor/vote_history')) {
  import('./modules/vote-history/descriptors')
} else if (location.pathname.startsWith('/misc/media_link_you_know')) {
  import('./modules/stream-link-missing')
}

import('./modules/search-bar')
