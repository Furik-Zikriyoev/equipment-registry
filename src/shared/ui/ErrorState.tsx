import { Button, Group, Stack, Text, Title } from '@mantine/core'
import { useT } from '../../i18n/useT'

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  secondaryLabel?: string
  onSecondary?: () => void
}

export function ErrorState({
  title,
  message,
  onRetry,
  secondaryLabel,
  onSecondary,
}: ErrorStateProps) {
  const t = useT()
  return (
    <Stack align="center" gap="xs" py="xl">
      <Title order={4}>{title ?? t.errors.loadTitle}</Title>
      <Text c="dimmed" size="sm" ta="center">
        {message}
      </Text>

      <Group mt="sm">
        {onRetry && <Button onClick={onRetry}>{t.errors.retry}</Button>}
        {secondaryLabel && onSecondary && (
          <Button variant="default" onClick={onSecondary}>
            {secondaryLabel}
          </Button>
        )}
      </Group>
    </Stack>
  )
}
