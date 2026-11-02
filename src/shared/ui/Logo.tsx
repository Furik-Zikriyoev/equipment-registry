import { Group, Stack, Text, ThemeIcon } from '@mantine/core'
import { IconBackhoe } from '@tabler/icons-react'
import { useT } from '../../i18n/useT'

interface LogoProps {
  compact?: boolean
}

export function Logo({ compact = false }: LogoProps) {
  const t = useT()
  return (
    <Group gap="sm" wrap="nowrap">
      <ThemeIcon size={compact ? 32 : 40} radius="md" color="brand">
        <IconBackhoe size={compact ? 20 : 24} stroke={1.8} />
      </ThemeIcon>
      <Stack gap={0}>
        <Text fw={800} fz={compact ? 'md' : 'lg'} lh={1.1}>
          {t.app.name}
        </Text>
        {!compact && (
          <Text fz="xs" c="dimmed" lh={1.2}>
            {t.app.tagline}
          </Text>
        )}
      </Stack>
    </Group>
  )
}
