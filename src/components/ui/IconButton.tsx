import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Kind = 'nav' | 'rail'

const kinds: Record<Kind, string> = {
  // Header controls: bare icon, no outline, 52px hit area.
  nav: 'h-10 w-10 lg:h-52 lg:w-52 border-transparent text-ink hover:text-accent',
  // Social rail in the mockup: 56px filled circle.
  rail: 'h-10 w-10 lg:h-56 lg:w-56 border-line-strong bg-surface-raised/80 text-ink-muted hover:border-accent hover:text-accent',
}

// Border colour lives in `kinds` only, so no two same-property classes compete.
const base = 'flex shrink-0 items-center justify-center rounded-full border transition-colors duration-150 ease-out'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  kind?: Kind
  children: ReactNode
}

export function IconButton({ kind = 'nav', className = '', children, ...props }: IconButtonProps) {
  return (
    <button type="button" className={`${base} ${kinds[kind]} cursor-pointer ${className}`} {...props}>
      {children}
    </button>
  )
}

type IconLinkProps = {
  href: string
  'aria-label': string
  kind?: Kind
  target?: string
  rel?: string
  download?: boolean
  className?: string
  children: ReactNode
}

export function IconLink({ kind = 'rail', className = '', children, ...props }: IconLinkProps) {
  return (
    <a className={`${base} ${kinds[kind]} ${className}`} {...props}>
      {children}
    </a>
  )
}
