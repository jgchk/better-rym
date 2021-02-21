/* eslint-disable import/no-default-export */

declare module '*.svg' {
  import { FunctionComponent, JSX } from 'preact'
  const value: FunctionComponent<JSX.SVGAttributes<SVGSVGElement>>
  export default value
}

declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}
