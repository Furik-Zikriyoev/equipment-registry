import { Button, Stack, Text, Title } from '@mantine/core'

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Stack align="center" gap="xs" py="xl">
      <Title order={4}>{title}</Title>
      <Text c="dimmed" size="sm" ta="center">
        {description}
      </Text>
      {actionLabel && onAction && (
        <Button mt="sm" variant="light" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Stack>
  )
}
