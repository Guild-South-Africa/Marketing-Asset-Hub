import { createContext, useContext, type ReactNode } from 'react'

export type RenderMode = 'thumbnail' | 'full'

const RenderModeContext = createContext<RenderMode>('full')

export function RenderModeProvider({ mode, children }: { mode: RenderMode; children: ReactNode }) {
  return <RenderModeContext.Provider value={mode}>{children}</RenderModeContext.Provider>
}

export function useRenderMode(): RenderMode {
  return useContext(RenderModeContext)
}
