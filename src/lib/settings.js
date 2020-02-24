export function set(key, value) {
  GM_setValue(key, value)
}

export function get(key, defaultValue) {
  return GM_getValue(key, defaultValue)
}
