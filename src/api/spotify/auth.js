const spotify_auth_callback_url = 'https://rateyourmusic.com/callback/spotify/'

const auth = {
  get access_token () {
    return GM_getValue('spotify-access-token')
  },
  set access_token (value) {
    GM_setValue('spotify-access-token', value)
  }
}

export function check_spotify_auth_callback () {
  if (is_spotify_auth_callback()) {
    process_spotify_auth_callback()
    return true
  } else {
    return false
  }
}

function is_spotify_auth_callback () {
  return window.location.href.startsWith(spotify_auth_callback_url)
}

function process_spotify_auth_callback () {
  const query = window.location.href.split('#').pop()
  const data = new URLSearchParams(query)
  auth.access_token = data.get('access_token')
  window.close()
}

function auth_implicit_grant (client_id) {
  GM_notification('Click to enable Spotify search for 1 hour', 'BetterRYM', spotify_icon, () => open_spotify_login(client_id))
}

function open_spotify_login (client_id) {
  const params = {
    client_id,
    response_type: 'token',
    redirect_uri: spotify_auth_callback_url
  }

  const query = $.param(params)
  const url = 'https://accounts.spotify.com/authorize?' + query

  GM_openInTab(url, false)

  const access_token_listener = GM_addValueChangeListener('spotify-access-token', (_name, _old_val, new_val) => {
    if (new_val) {
      GM_removeValueChangeListener(access_token_listener)
      window.location.reload(false)
    }
  })
}
