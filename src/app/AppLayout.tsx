import { Outlet } from 'react-router-dom'
import { AppShell, Container, Group, Title } from '@mantine/core'
import { IconTruck } from '@tabler/icons-react'

export function AppLayout() {
  return (
    <AppShell header={{ height: 64 }} padding="lg">
      <AppShell.Header withBorder>
        <Group h="100%" justify="center" gap="xs">
          <IconTruck size={24} stroke={1.6} color="var(--mantine-color-blue-6)" />
          <Title order={4} fw={600} style={{ letterSpacing: '0.02em' }}>
            Реестр техники
          </Title>
        </Group>
      </AppShell.Header>

      <AppShell.Main bg="gray.0">
        <Container size="xl">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  )
}
