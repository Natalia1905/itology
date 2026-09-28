/// <reference types="vite/client" />

declare module '*.glsl?raw' {
  const source: string
  export default source
}

declare module '*.jsx' {
  import type { ComponentType } from 'react'
  const component: ComponentType<Record<string, unknown>>
  export default component
}
