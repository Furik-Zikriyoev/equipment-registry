import { Button, Stack, Text, Title } from '@mantine/core'

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Stack align="center" gap="xs" py="xl">
      <Title order={4}>Не удалось загрузить данные</Title>
      <Text c="dimmed" size="sm" ta="center">
        {message}
      </Text>
      <Button mt="sm" onClick={onRetry}>
        Повторить
      </Button>
    </Stack>
  )
}
