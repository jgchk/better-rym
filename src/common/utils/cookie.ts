export const getCookie = (cname: string): string => {
  const name = cname + '='
  const ca = document.cookie.split(';')
  for (let c of ca) {
    while (c.charAt(0) == ' ') {
      c = c.slice(1)
    }
    if (c.indexOf(name) == 0) {
      return c.slice(name.length, c.length)
    }
  }
  return ''
}
