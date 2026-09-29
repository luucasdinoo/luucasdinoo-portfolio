import { Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { social } from '../../config/site'
import { GithubIcon, LinkedinIcon } from '../ui/BrandIcons'
import { IconLink } from '../ui/IconButton'

const iconClass = 'h-5 w-5 lg:h-26 lg:w-26'

type SocialRailProps = {
  layout: 'rail' | 'row'
}

export function SocialRail({ layout }: SocialRailProps) {
  const { t } = useTranslation()

  return (
    <div className={layout === 'rail' ? 'flex w-64 flex-col items-center gap-18' : 'flex flex-row items-center gap-3'}>
      <IconLink href={social.github} target="_blank" rel="noreferrer" aria-label={t('social.github')}>
        <GithubIcon className={iconClass} />
      </IconLink>
      <IconLink href={social.linkedin} target="_blank" rel="noreferrer" aria-label={t('social.linkedin')}>
        <LinkedinIcon className={iconClass} />
      </IconLink>
      <IconLink href={social.email} aria-label={t('social.email')}>
        <Mail aria-hidden className={iconClass} />
      </IconLink>
      {layout === 'rail' && <div aria-hidden className="h-40 w-2 bg-line-strong" />}
    </div>
  )
}
