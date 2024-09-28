import { ResolveData } from '../../common/services/types'

interface CustomEventMap {
  importEvent: CustomEvent<ResolveData>
  fillEvent: CustomEvent<FillData>
}

export type FillData = {
  filledField: 'date'
}

declare global {
  interface Document {
    //adds definition to Document, but you can do the same with HTMLElement
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void,
    ): void
    removeEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void,
    ): void
  }
}

export {}
