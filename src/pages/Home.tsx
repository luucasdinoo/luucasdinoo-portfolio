import { ChevronDown } from 'lucide-react'
import { motion, MotionConfig, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import avatar from '../assets/avatar.webp'
import { AboutSection } from '../components/about/AboutSection'
import { AvatarOrb } from '../components/home/AvatarOrb'
import { HeroIntro } from '../components/home/HeroIntro'
import { QuickNav } from '../components/home/QuickNav'
import { SocialRail } from '../components/home/SocialRail'
import { quickNavSections } from '../config/site'

export function Home() {
  const { t, i18n } = useTranslation()
  const reducedMotion = useReducedMotion()
  const heroRef = useRef<HTMLElement>(null)

  // 0 while the hero fills the screen → 1 once it has scrolled fully out of view.
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const y = useTransform(scrollYProgress, [0, 1], [0, -120])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94])
  const filter = useTransform(scrollYProgress, [0, 0.6], ['blur(0px)', 'blur(6px)'])
  const exit = reducedMotion ? { opacity } : { opacity, y, scale, filter }

  return (
    <MotionConfig reducedMotion="user">
      <main>
        <section
          ref={heroRef}
          className="mockup relative flex min-h-dvh flex-col items-center overflow-hidden px-4 pt-24 pb-10 lg:block lg:h-dvh lg:min-h-0 lg:p-0"
        >
          <motion.div style={exit} className="absolute top-430 left-72 z-10 hidden lg:block">
            <SocialRail layout="rail" />
          </motion.div>

          <motion.div
            style={exit}
            className="relative z-10 flex w-full flex-col items-center gap-6 lg:absolute lg:top-150 lg:left-1/2 lg:w-1200 lg:-translate-x-1/2 lg:gap-32"
          >
            <HeroIntro key={i18n.language} />
            <div className="lg:hidden">
              <SocialRail layout="row" />
            </div>
            <AvatarOrb src={avatar} alt={t('hero.avatarAlt')} />
            <QuickNav />
          </motion.div>

          {/* In flow at the bottom on mobile; pinned under the cards on desktop. */}
          <motion.a
            href="#sobre"
            aria-label={t('hero.scrollHint')}
            style={{ opacity }}
            className="relative z-10 mt-auto flex h-12 w-12 items-center justify-center pt-4 text-ink-muted transition-colors duration-150 hover:text-accent lg:absolute lg:bottom-24 lg:left-1/2 lg:mt-0 lg:h-56 lg:w-56 lg:-translate-x-1/2 lg:pt-0"
          >
            <ChevronDown aria-hidden strokeWidth={1.75} className="scroll-cue h-7 w-7 lg:h-40 lg:w-40" />
          </motion.a>
        </section>

        <AboutSection />

        {quickNavSections
          .filter(({ id }) => id !== 'sobre')
          .map(({ id }) => (
            <section key={id} id={id} />
          ))}
      </main>
    </MotionConfig>
  )
}
