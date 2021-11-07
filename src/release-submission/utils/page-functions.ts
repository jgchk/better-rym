export const selectShortcut = (
  type: string,
  id: number,
  name: string,
  target: string
): void => {
  const script = document.createElement('script')
  script.innerHTML = `selectShortcut('${type}', ${id}, '${name}', '${target}')`
  document.head.append(script)
  script.remove()
}
