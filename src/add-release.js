const add_release_url = 'https://rateyourmusic.com/releases/ac'

export function check_add_release_page() {
  if (is_add_release_page()) {
    console.log('release page!!!')
    return true
  } else {
    return false
  }
}

function is_add_release_page() {
  return window.location.href.startsWith(add_release_url)
}
