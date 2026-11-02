import { Link, Outlet, useLocation } from 'react-router-dom'
import { AppShell, Badge, Burger, Container, Group, NavLink, Stack, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import type { Icon } from '@tabler/icons-react'
import { IconLayoutDashboard, IconPlus, IconTruck } from '@tabler/icons-react'

import { Logo } from '../shared/ui/Logo'
import { ThemeToggle } from '../shared/ui/ThemeToggle'
import classes from './AppLayout.module.css'

interface NavItem {
  to: string
  label: string
  icon: Icon
  isActive: (pathname: string) => boolean
}

const NAV_ITEMS: NavItem[] = [
  {
    to: '/dashboard',
    label: 'Обзор',
    icon: IconLayoutDashboard,
    isActive: (pathname) => pathname === '/dashboard',
  },
  {
    to: '/units',
    label: 'Техника',
    icon: IconTruck,
    isActive: (pathname) => pathname.startsWith('/units') && pathname !== '/units/new',
  },
  {
    to: '/units/new',
    label: 'Добавить технику',
    icon: IconPlus,
    isActive: (pathname) => pathname === '/units/new',
  },
]

const todayText = new Intl.DateTimeFormat('ru-RU', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
}).format(new Date())
const todayLabel = todayText.charAt(0).toUpperCase() + todayText.slice(1)

export function AppLayout() {
  const [opened, { toggle, close }] = useDisclosure()
  const { pathname } = useLocation()

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 248, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding={{ base: 'md', sm: 'xl' }}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between" wrap="nowrap">
          <Group gap="sm" wrap="nowrap">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
              aria-label="Открыть меню"
            />
            <Stack hiddenFrom="sm">
              <Logo compact />
            </Stack>
            <Text visibleFrom="sm" size="sm" c="dimmed">
              {todayLabel}
            </Text>
          </Group>

          <Group gap="xs" wrap="nowrap">
            <Badge variant="light" color="gray" radius="sm" visibleFrom="xs">
              Демо-данные
            </Badge>
            <ThemeToggle />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md" className={classes.navbar}>
        <AppShell.Section mb="xl" visibleFrom="sm">
          <Logo />
        </AppShell.Section>

        <AppShell.Section grow>
          <Stack gap={4}>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                component={Link}
                to={item.to}
                label={item.label}
                leftSection={<item.icon size={20} stroke={1.7} />}
                active={item.isActive(pathname)}
                variant="light"
                fw={600}
                style={{ borderRadius: 'var(--mantine-radius-md)' }}
                onClick={close}
              />
            ))}
          </Stack>
        </AppShell.Section>

        <AppShell.Section>
          <Text size="xs" c="dimmed" lh={1.5}>
            Демо-версия. Данные генерируются в браузере и сбрасываются при перезагрузке страницы.
          </Text>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main className={classes.main}>
        <Container size="xl" px={0}>
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  )
}
