export function capitalize (str) {
  return str.replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase() })
}
