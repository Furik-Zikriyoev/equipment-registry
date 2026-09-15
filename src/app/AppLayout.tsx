import { Outlet } from "react-router-dom";
import { AppShell, Container, Group, Title } from "@mantine/core";

export function AppLayout() {
  return (
    <AppShell header={{ height: 56 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md">
          <Title order={4}>Реестр техники</Title>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="xl">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
