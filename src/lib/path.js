import { arraysEqual } from './array'

export function splitPath() {
  return window.location.pathname.split('/')
}

export function joinPath(path) {
  return `/${path.join('/')}`
}

export function inPath(...path) {
  const currentPath = splitPath()
  if (currentPath.length - 1 < path.length) return false
  return arraysEqual(path, currentPath.slice(1, path.length + 1))
}
