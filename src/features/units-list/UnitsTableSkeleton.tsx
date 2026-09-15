import { Skeleton, Stack } from '@mantine/core'

export function UnitsTableSkeleton() {
  return (
    <Stack gap="xs">
      <Skeleton height={32} radius="sm" />
      {Array.from({ length: 10 }, (_, index) => (
        <Skeleton key={index} height={40} radius="sm" />
      ))}
    </Stack>
  )
}
