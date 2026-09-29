import { Keyboard, Volume2, VolumeX } from 'lucide-react'
import { motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { skillColumns, skills, type SkillCategory, type SkillKey } from '../../content/skills'
import { keySound } from '../../lib/keySound'
import { Eyebrow } from '../ui/Eyebrow'

type SkillEntry = (typeof skills)[number]

const categories: SkillCategory[] = ['backend', 'data', 'devops', 'quality', 'frontend']
const byHotkey = new Map<string, SkillEntry>(skills.map((skill) => [skill.hotkey, skill]))
const rows = Math.ceil(skills.length / skillColumns)

// Isometric resting angle of the board; the pointer tilts it a few degrees around this.
const baseTilt = { x: 54, z: -38 }
const capLayers = 6
const soundStorageKey = 'skills-sound'

function readSoundPreference(): boolean {
  try {
    return localStorage.getItem(soundStorageKey) !== 'off'
  } catch {
    return true
  }
}
const boardLayers = 5

function SkillIcon({ skill, className = '' }: { skill: SkillEntry; className?: string }) {
  if ('icon' in skill) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
        <path d={skill.icon} />
      </svg>
    )
  }
  return (
    <span aria-hidden className="font-display leading-none font-bold tracking-[-0.02em]" style={{ fontSize: 'calc(var(--k) * 0.3)' }}>
      {skill.label}
    </span>
  )
}

type KeycapProps = {
  skill: SkillEntry
  index: number
  entered: boolean
  landed: boolean
  pressed: boolean
  hovered: boolean
  selected: boolean
  onPress: (key: SkillKey) => void
  onRelease: (key: SkillKey) => void
  onHover: (key: SkillKey | null) => void
  onLanded: () => void
}

function Keycap({ skill, index, entered, landed, pressed, hovered, selected, onPress, onRelease, onHover, onLanded }: KeycapProps) {
  const { t } = useTranslation()
  const col = index % skillColumns
  const row = Math.floor(index / skillColumns)
  const restZ = pressed ? 2 : hovered ? 16 : 9

  return (
    <button
      type="button"
      data-variant={skill.category}
      aria-label={`${skill.name}, ${t(`skills.categories.${skill.category}`)}`}
      aria-pressed={selected}
      aria-keyshortcuts={skill.hotkey.toUpperCase()}
      onPointerDown={() => onPress(skill.key)}
      onPointerUp={() => onRelease(skill.key)}
      onPointerLeave={() => {
        onRelease(skill.key)
        onHover(null)
      }}
      onPointerEnter={(event) => event.pointerType === 'mouse' && onHover(skill.key)}
      onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && !event.repeat && onPress(skill.key)}
      onKeyUp={() => onRelease(skill.key)}
      onBlur={() => onRelease(skill.key)}
      className="kb-key group"
      style={
        {
          left: `calc(var(--pad) + ${col} * (var(--k) + var(--gap)))`,
          top: `calc(var(--pad) + ${row} * (var(--k) + var(--gap)))`,
        } as CSSProperties
      }
    >
      <motion.span
        className="kb-cap"
        initial={{ z: 180 }}
        animate={{ z: entered ? restZ : 180 }}
        transition={landed ? { type: 'spring', stiffness: 900, damping: 32 } : { type: 'spring', stiffness: 240, damping: 20, delay: index * 0.035 }}
        onAnimationComplete={() => index === skills.length - 1 && entered && onLanded()}
      >
        {Array.from({ length: capLayers }, (_, layer) => (
          <span key={layer} aria-hidden className="kb-cap-layer" style={{ '--layer': layer / (capLayers - 1) } as CSSProperties} />
        ))}
        <span className={`kb-cap-top ${selected ? 'is-selected' : ''}`}>
          <span aria-hidden className="kb-cap-legend">
            {skill.hotkey}
          </span>
          <SkillIcon skill={skill} className="h-[42%] w-[42%]" />
        </span>
      </motion.span>
    </button>
  )
}

export function SkillsSection() {
  const { t } = useTranslation()
  const reducedMotion = useReducedMotion()
  const headerRef = useRef<HTMLElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState<SkillKey>('java')
  const [pressed, setPressed] = useState<ReadonlySet<SkillKey>>(() => new Set())
  const [hovered, setHovered] = useState<SkillKey | null>(null)
  const [landed, setLanded] = useState(false)
  const entered = useInView(sceneRef, { once: true, amount: 0.35 })
  const inView = useInView(sceneRef, { amount: 0.35 })

  // Header rises in with the scroll, same choreography as the About section.
  const { scrollYProgress } = useScroll({ target: headerRef, offset: ['start end', 'start 55%'] })
  const headerOpacity = useTransform(scrollYProgress, [0, 1], [0, 1])
  const headerY = useTransform(scrollYProgress, [0, 1], [48, 0])

  // Pointer tilt around the isometric resting angle.
  const tiltX = useMotionValue(baseTilt.x)
  const tiltZ = useMotionValue(baseTilt.z)
  const rotateX = useSpring(tiltX, { stiffness: 120, damping: 18 })
  const rotateZ = useSpring(tiltZ, { stiffness: 120, damping: 18 })

  const onScenePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType !== 'mouse') return
    const box = event.currentTarget.getBoundingClientRect()
    const nx = ((event.clientX - box.left) / box.width) * 2 - 1
    const ny = ((event.clientY - box.top) / box.height) * 2 - 1
    tiltX.set(baseTilt.x - ny * 6)
    tiltZ.set(baseTilt.z + nx * 6)
  }

  const onScenePointerLeave = () => {
    tiltX.set(baseTilt.x)
    tiltZ.set(baseTilt.z)
  }

  const [soundOn, setSoundOn] = useState(readSoundPreference)
  const soundOnRef = useRef(soundOn)
  // Mirror of `pressed` for the event handlers, so each switch clacks once on the way down and once on the way up.
  const pressedRef = useRef(new Set<SkillKey>())

  const toggleSound = () => {
    const next = !soundOn
    setSoundOn(next)
    soundOnRef.current = next
    try {
      localStorage.setItem(soundStorageKey, next ? 'on' : 'off')
    } catch {
      // Private mode or blocked storage: the choice just lasts for this visit.
    }
  }

  const press = useCallback((key: SkillKey) => {
    setSelected(key)
    if (pressedRef.current.has(key)) return
    pressedRef.current.add(key)
    setPressed(new Set(pressedRef.current))
    if (soundOnRef.current) keySound.press()
  }, [])

  const release = useCallback((key: SkillKey) => {
    if (!pressedRef.current.delete(key)) return
    setPressed(new Set(pressedRef.current))
    if (soundOnRef.current) keySound.release()
  }, [])

  const hover = useCallback((key: SkillKey | null) => {
    setHovered(key)
    if (key && soundOnRef.current) keySound.hover()
  }, [])

  // Physical keys press their keycap while the keyboard is on screen and nothing else wants the keystroke.
  useEffect(() => {
    if (!inView) return
    const skillFor = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return undefined
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable="true"]')) return undefined
      if (document.getElementById('root')?.hasAttribute('inert')) return undefined
      return byHotkey.get(event.key.toLowerCase())
    }
    const onKeyDown = (event: KeyboardEvent) => {
      const skill = skillFor(event)
      if (skill && !event.repeat) press(skill.key)
    }
    const onKeyUp = (event: KeyboardEvent) => {
      const skill = skillFor(event)
      if (skill) release(skill.key)
    }
    const onBlur = () => {
      pressedRef.current.clear()
      setPressed(new Set())
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [inView, press, release])

  const current = skills.find((skill) => skill.key === selected) ?? skills[0]

  return (
    <section id="skills" aria-labelledby="skills-title" className="scroll-mt-28 px-4 py-16 sm:px-8 lg:px-28 lg:py-24">
      <div className="mx-auto max-w-[1200px]">
        <motion.header
          ref={headerRef}
          style={reducedMotion ? undefined : { opacity: headerOpacity, y: headerY }}
          className="mb-8 flex flex-col gap-3 lg:mb-12"
        >
          <Eyebrow>{t('skills.eyebrow')}</Eyebrow>
          <h2 id="skills-title" className="font-display text-[32px] leading-[1.1] font-bold tracking-[-0.02em] text-ink lg:text-[40px]">
            {t('skills.title')}
          </h2>
        </motion.header>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
          <div>
            <div className="flex items-center justify-center gap-4">
              <p className="flex items-center gap-2 font-mono text-[12px] leading-4 tracking-[0.12em] text-ink-subtle uppercase">
                <Keyboard aria-hidden size={16} strokeWidth={1.75} className="text-accent" />
                {t('skills.hint')}
              </p>
              <button
                type="button"
                onClick={toggleSound}
                aria-pressed={soundOn}
                aria-label={t('skills.sound')}
                title={t('skills.sound')}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-line-strong bg-surface-raised/90 text-ink-muted transition-colors duration-150 ease-out hover:border-accent hover:text-accent"
              >
                {soundOn ? <Volume2 aria-hidden size={16} strokeWidth={1.75} /> : <VolumeX aria-hidden size={16} strokeWidth={1.75} />}
              </button>
            </div>

            <div
              ref={sceneRef}
              onPointerMove={onScenePointerMove}
              onPointerLeave={onScenePointerLeave}
              className="kb-scene flex min-h-[300px] items-center justify-center sm:min-h-[400px] lg:min-h-[460px]"
            >
              <motion.div
                role="group"
                aria-label={t('skills.boardLabel')}
                className="kb-board"
                style={{ rotateX, rotateZ, '--cols': skillColumns, '--rows': rows } as unknown as CSSProperties}
              >
                <span aria-hidden className="kb-floor" />
                {Array.from({ length: boardLayers }, (_, layer) => (
                  <span key={layer} aria-hidden className="kb-slab" style={{ '--layer': layer } as CSSProperties} />
                ))}
                <span aria-hidden className="kb-plate" />

                {skills.map((skill, index) => (
                  <Keycap
                    key={skill.key}
                    skill={skill}
                    index={index}
                    entered={entered || !!reducedMotion}
                    landed={landed || !!reducedMotion}
                    pressed={pressed.has(skill.key)}
                    hovered={hovered === skill.key}
                    selected={selected === skill.key}
                    onPress={press}
                    onRelease={release}
                    onHover={hover}
                    onLanded={() => setLanded(true)}
                  />
                ))}
              </motion.div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div aria-live="polite" className="rounded-lg border border-accent/45 bg-surface-raised/85 p-6">
              <div className="flex items-center justify-between gap-3">
                <Eyebrow>{t(`skills.categories.${current.category}`)}</Eyebrow>
                <span className="flex items-center gap-2 font-mono text-[11px] leading-4 tracking-[0.12em] text-ink-subtle uppercase">
                  {t('skills.hotkey')}
                  <kbd className="rounded-sm border border-line-strong bg-surface px-1.5 py-0.5 font-mono text-[12px] leading-4 font-semibold text-ink">
                    {current.hotkey.toUpperCase()}
                  </kbd>
                </span>
              </div>
              <div className="mt-5 flex items-center gap-4">
                <span data-variant={current.category} className="kb-swatch flex h-14 w-14 shrink-0 items-center justify-center rounded-md" style={{ '--k': '56px' } as CSSProperties}>
                  <SkillIcon skill={current} className="h-7 w-7" />
                </span>
                <h3 className="font-display text-[28px] leading-[34px] font-bold tracking-[-0.015em] text-ink">{current.name}</h3>
              </div>
              <p className="mt-4 text-[16px] leading-[26px] text-ink-muted">{t(`skills.items.${current.key}`)}</p>
            </div>

            <div>
              <Eyebrow>{t('skills.categoriesLabel')}</Eyebrow>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                {categories.map((category) => (
                  <li key={category} className="flex items-center gap-2 text-[14px] leading-5 text-ink-muted">
                    <span aria-hidden data-variant={category} className="kb-swatch h-3 w-3 rounded-sm" />
                    {t(`skills.categories.${category}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
