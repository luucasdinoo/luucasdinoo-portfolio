import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { fadeRise } from './fadeRise'
import { parseAccent, segmentsLength } from './typedSegments'
import { TypedText } from './TypedText'

const START_DELAY = 400
const EYEBROW_MS = 55
const PAUSE_MS = 350
const TITLE_MS = 70

export function HeroIntro() {
  const { t } = useTranslation()
  const reducedMotion = useReducedMotion()

  const eyebrow = useMemo(() => [{ text: t('hero.eyebrow') }], [t])
  const title = useMemo(() => parseAccent(t('hero.title')), [t])
  const eyebrowLength = segmentsLength(eyebrow)
  const total = eyebrowLength + segmentsLength(title)

  const [typed, setTyped] = useState(0)

  useEffect(() => {
    if (reducedMotion) return
    let count = 0
    let timer: ReturnType<typeof setTimeout>
    const tick = () => {
      count += 1
      setTyped(count)
      if (count >= total) return
      const delay = count === eyebrowLength ? PAUSE_MS : count < eyebrowLength ? EYEBROW_MS : TITLE_MS
      timer = setTimeout(tick, delay)
    }
    timer = setTimeout(tick, START_DELAY)
    return () => clearTimeout(timer)
  }, [reducedMotion, total, eyebrowLength])

  const shown = reducedMotion ? total : typed
  const caretMode = shown > 0 && shown < total ? 'typing' : 'blink'
  const onEyebrow = shown < eyebrowLength

  return (
    <>
      <p className="font-mono text-[14px] font-semibold tracking-[2px] text-accent-ink uppercase lg:text-m-24 lg:tracking-[calc(var(--u)*3)]">
        <span className="sr-only">{t('hero.eyebrow')}</span>
        <span aria-hidden>
          <TypedText segments={eyebrow} shown={Math.min(shown, eyebrowLength)} caret={!reducedMotion && onEyebrow ? caretMode : 'none'} />
        </span>
      </p>
      <h1 className="text-center font-display text-[44px] leading-[1.05] font-bold tracking-[-1.5px] text-ink sm:text-[56px] lg:text-m-104 lg:tracking-[calc(var(--u)*-3)] lg:whitespace-nowrap">
        <span className="sr-only">{title.map((s) => s.text).join('')}</span>
        <span aria-hidden>
          <TypedText segments={title} shown={Math.max(0, shown - eyebrowLength)} caret={!reducedMotion && !onEyebrow ? caretMode : 'none'} />
        </span>
      </h1>
      <motion.p
        {...fadeRise(0.1)}
        className="max-w-[560px] text-center font-sans text-[18px] leading-[1.4] text-ink-muted lg:max-w-none lg:text-m-28"
      >
        {t('hero.lead')}
      </motion.p>
    </>
  )
}
