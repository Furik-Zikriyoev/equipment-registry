import { Group, Stack, Text, ThemeIcon } from '@mantine/core'
import { IconBackhoe } from '@tabler/icons-react'

interface LogoProps {
  compact?: boolean
}

export function Logo({ compact = false }: LogoProps) {
  return (
    <Group gap="sm" wrap="nowrap">
      <ThemeIcon size={compact ? 32 : 40} radius="md" color="brand">
        <IconBackhoe size={compact ? 20 : 24} stroke={1.8} />
      </ThemeIcon>
      <Stack gap={0}>
        <Text fw={800} fz={compact ? 'md' : 'lg'} lh={1.1}>
          Техпарк
        </Text>
        {!compact && (
          <Text fz="xs" c="dimmed" lh={1.2}>
            учёт строительной техники
          </Text>
        )}
      </Stack>
    </Group>
  )
}
