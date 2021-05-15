export type ClassValue = string | false | undefined

export const clsx = (...arguments_: ClassValue[]): string =>
  arguments_.filter((argument) => !!argument).join(' ')
