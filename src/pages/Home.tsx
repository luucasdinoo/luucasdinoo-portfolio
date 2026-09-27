import { MotionConfig } from 'motion/react'
import { useTranslation } from 'react-i18next'
import avatar from '../assets/avatar.webp'
import { AvatarOrb } from '../components/home/AvatarOrb'
import { HeroIntro } from '../components/home/HeroIntro'
import { MockupFluid } from '../components/home/MockupFluid'
import { QuickNav } from '../components/home/QuickNav'
import { SocialRail } from '../components/home/SocialRail'
import { quickNavSections } from '../config/site'

const veil =
  'radial-gradient(ellipse at 50% 48%, color-mix(in srgb, var(--surface) 78%, transparent) 0%, color-mix(in srgb, var(--surface) 35%, transparent) 45%, transparent 70%)'

export function Home() {
  const { t, i18n } = useTranslation()

  return (
    <MotionConfig reducedMotion="user">
      <main>
        <section className="mockup relative flex min-h-dvh flex-col items-center overflow-hidden bg-surface px-4 pt-24 pb-10 lg:block lg:h-dvh lg:min-h-0 lg:p-0">
          <MockupFluid />
          <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: veil }} />

          <div className="absolute top-430 left-72 z-10 hidden lg:block">
            <SocialRail layout="rail" />
          </div>

          <div className="relative z-10 flex w-full flex-col items-center gap-6 lg:absolute lg:top-150 lg:left-1/2 lg:w-1200 lg:-translate-x-1/2 lg:gap-32">
            <HeroIntro key={i18n.language} />
            <div className="lg:hidden">
              <SocialRail layout="row" />
            </div>
            <AvatarOrb src={avatar} alt={t('hero.avatarAlt')} />
            <QuickNav />
          </div>
        </section>

        {quickNavSections.map(({ id }) => (
          <section key={id} id={id} />
        ))}
      </main>
    </MotionConfig>
  )
}
