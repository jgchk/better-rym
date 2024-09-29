import { runScript } from '../../../common/utils/dom'

export const selectShortcut = (
  type: string,
  id: number,
  name: string,
  target: string,
): void =>
  void runScript(
    `selectShortcut(\`${type}\`, ${id}, \`${name}\`, \`${target}\`)`,
  )

// window.parent.goInfobox(897)
export const goInfobox = (id: number): void =>
  void runScript(`goInfobox(${id})`)
