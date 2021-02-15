declare module '*.svg' {
  const svg: string
  export default svg
}

declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}
