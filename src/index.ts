if (location.pathname.startsWith('/release/')) {
  import('./find-stream-links')
} else if (location.pathname.startsWith('/releases/ac')) {
  import('./release-submission')
} else if (location.pathname.startsWith('/images/upload')) {
  import('./cover-art')
} else if (location.pathname.startsWith('/submit_media_link')) {
  import('./submit-stream-links')
} else if (location.pathname.startsWith('/collection')) {
  import('./filter-collection')
} else if (location.pathname.startsWith('/~')) {
  import('./user-page')
} else if (location.pathname.startsWith('/rgenre/vote_history')) {
  import('./vote-history/genres')
} else if (location.pathname.startsWith('/rdescriptor/vote_history')) {
  import('./vote-history/descriptors')
}

import('./search-bar')
