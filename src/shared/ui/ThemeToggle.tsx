import { ActionIcon, Tooltip, useComputedColorScheme, useMantineColorScheme } from '@mantine/core'
import { IconMoon, IconSun } from '@tabler/icons-react'

export function ThemeToggle() {
  const { setColorScheme } = useMantineColorScheme()
  const scheme = useComputedColorScheme('light', { getInitialValueInEffect: true })
  const isDark = scheme === 'dark'

  return (
    <Tooltip label={isDark ? 'Светлая тема' : 'Тёмная тема'}>
      <ActionIcon
        variant="default"
        size="lg"
        aria-label="Переключить тему"
        onClick={() => setColorScheme(isDark ? 'light' : 'dark')}
      >
        {isDark ? <IconSun size={18} stroke={1.8} /> : <IconMoon size={18} stroke={1.8} />}
      </ActionIcon>
    </Tooltip>
  )
}
