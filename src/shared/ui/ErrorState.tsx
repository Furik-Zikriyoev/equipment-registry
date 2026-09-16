import { Button, Group, Stack, Text, Title } from '@mantine/core'

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  secondaryLabel?: string
  onSecondary?: () => void
}

export function ErrorState({
  title = 'Не удалось загрузить данные',
  message,
  onRetry,
  secondaryLabel,
  onSecondary,
}: ErrorStateProps) {
  return (
    <Stack align="center" gap="xs" py="xl">
      <Title order={4}>{title}</Title>
      <Text c="dimmed" size="sm" ta="center">
        {message}
      </Text>

      <Group mt="sm">
        {onRetry && <Button onClick={onRetry}>Повторить</Button>}
        {secondaryLabel && onSecondary && (
          <Button variant="default" onClick={onSecondary}>
            {secondaryLabel}
          </Button>
        )}
      </Group>
    </Stack>
  )
}
