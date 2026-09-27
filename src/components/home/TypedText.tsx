import type { ReactNode } from 'react'
import type { Segment } from './typedSegments'

type TypedTextProps = {
  segments: Segment[]
  shown: number
  caret: 'none' | 'typing' | 'blink'
}

function Caret({ mode }: { mode: 'typing' | 'blink' }) {
  // Zero-width inline anchor with an out-of-flow bar: no layout shift, no extra line-break opportunity.
  return (
    <span aria-hidden className="relative">
      <span className={`typed-caret absolute top-[0.12em] left-[0.02em] h-[0.86em] w-[0.06em] bg-accent ${mode === 'blink' ? 'typed-caret-blink' : ''}`} />
    </span>
  )
}

/**
 * Renders the full text so layout never moves; characters past `shown` stay
 * invisible (not removed), keeping the final width and line breaks from the start.
 */
export function TypedText({ segments, shown, caret }: TypedTextProps) {
  const nodes: ReactNode[] = []
  let offset = 0
  let caretPlaced = false

  segments.forEach((segment, i) => {
    const chars = [...segment.text]
    const visibleCount = Math.max(0, Math.min(chars.length, shown - offset))
    const className = segment.accent ? 'text-accent' : undefined

    if (visibleCount > 0) {
      nodes.push(
        <span key={`v${i}`} className={className}>
          {chars.slice(0, visibleCount).join('')}
        </span>,
      )
    }
    if (caret !== 'none' && !caretPlaced && shown - offset < chars.length) {
      nodes.push(<Caret key="caret" mode={caret} />)
      caretPlaced = true
    }
    if (visibleCount < chars.length) {
      nodes.push(
        <span key={`h${i}`} className={className} style={{ visibility: 'hidden' }}>
          {chars.slice(visibleCount).join('')}
        </span>,
      )
    }
    offset += chars.length
  })

  if (caret !== 'none' && !caretPlaced) nodes.push(<Caret key="caret" mode={caret} />)

  return <>{nodes}</>
}
