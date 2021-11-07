const runScript = (script: string) => {
  const element = document.createElement('script')
  element.innerHTML = script
  document.head.append(element)
  element.remove()
}

export const selectShortcut = (
  type: string,
  id: number,
  name: string,
  target: string
): void => runScript(`selectShortcut('${type}', ${id}, '${name}', '${target}')`)

// window.parent.goInfobox(897)
export const goInfobox = (id: number): void => runScript(`goInfobox(${id})`)
