import { ActionIcon, Tooltip, useComputedColorScheme, useMantineColorScheme } from '@mantine/core'
import { IconMoon, IconSun } from '@tabler/icons-react'
import { useT } from '../../i18n/useT'

export function ThemeToggle() {
  const t = useT()
  const { setColorScheme } = useMantineColorScheme()
  const scheme = useComputedColorScheme('light', { getInitialValueInEffect: true })
  const isDark = scheme === 'dark'

  return (
    <Tooltip label={isDark ? t.theme.light : t.theme.dark}>
      <ActionIcon
        variant="default"
        size="lg"
        aria-label={t.theme.toggle}
        onClick={() => setColorScheme(isDark ? 'light' : 'dark')}
      >
        {isDark ? <IconSun size={18} stroke={1.8} /> : <IconMoon size={18} stroke={1.8} />}
      </ActionIcon>
    </Tooltip>
  )
}
