import { Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../hooks/useTheme'
import { IconButton } from '../ui/IconButton'

export function ThemeToggle() {
  const { t } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const Icon = theme === 'dark' ? Moon : Sun

  return (
    <IconButton
      kind="nav"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? t('theme.switchToLight') : t('theme.switchToDark')}
      aria-pressed={theme === 'dark'}
    >
      <Icon aria-hidden className="h-5 w-5 lg:h-28 lg:w-28" />
    </IconButton>
  )
}
