import type { AnchorHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'lg' | 'mockup'

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant
  size?: Size
  children: ReactNode
}

const variants: Record<Variant, string> = {
  primary: 'border-transparent bg-primary text-on-primary hover:bg-primary-hover hover:shadow-glow',
  secondary: 'border-line-strong text-ink hover:border-accent hover:text-accent-ink',
  ghost: 'border-transparent text-link hover:underline hover:underline-offset-4',
}

// Padding lives only here (never in variants) so no two classes fight over it.
const sizes: Record<Size, { box: string; padding: string }> = {
  md: { box: 'h-10 text-[14px] leading-5 rounded-md', padding: 'px-4' },
  lg: { box: 'h-12 text-[16px] rounded-md', padding: 'px-6' },
  // Navbar button in the home mockup: 24px Inter 600, 12/24 padding, 8px radius at 1920.
  mockup: {
    box: 'h-10 text-[14px] rounded-md lg:h-auto lg:text-m-24 lg:leading-[1.2] lg:rounded-m-8',
    padding: 'px-4 lg:px-24 lg:py-12',
  },
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  const { box, padding } = sizes[size]
  return (
    <a
      className={`inline-flex items-center justify-center gap-2 border font-sans font-semibold whitespace-nowrap no-underline transition-[background-color,box-shadow,color,border-color] duration-150 ease-out ${variants[variant]} ${box} ${variant === 'ghost' ? 'px-2' : padding} ${className}`}
      {...props}
    >
      {children}
    </a>
  )
}
