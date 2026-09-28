import type { ReactNode } from 'react'

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="font-mono text-[12px] leading-4 font-semibold tracking-[0.12em] text-accent-ink uppercase">{children}</p>
}
