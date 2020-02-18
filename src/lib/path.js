import { arraysEqual } from './array'

// eslint-disable-next-line import/prefer-default-export
export function inPath(...path) {
  const currentPath = window.location.pathname.split('/')
  if (currentPath.length - 1 < path.length) return false
  return arraysEqual(path, currentPath.slice(1, path.length + 1))
}
