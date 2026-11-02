import { Link, Outlet, useLocation } from 'react-router-dom'
import { AppShell, Badge, Burger, Container, Group, NavLink, Stack, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import type { Icon } from '@tabler/icons-react'
import { IconLayoutDashboard, IconPlus, IconTruck } from '@tabler/icons-react'

import { useLang, useT } from '../i18n/useT'
import { intlLocale } from '../i18n/lang'
import type { Messages } from '../i18n/messages'
import { LangSwitch } from '../shared/ui/LangSwitch'
import { Logo } from '../shared/ui/Logo'
import { ThemeToggle } from '../shared/ui/ThemeToggle'
import classes from './AppLayout.module.css'

interface NavItem {
  to: string
  label: (t: Messages) => string
  icon: Icon
  isActive: (pathname: string) => boolean
}

const NAV_ITEMS: NavItem[] = [
  {
    to: '/dashboard',
    label: (t) => t.nav.dashboard,
    icon: IconLayoutDashboard,
    isActive: (pathname) => pathname === '/dashboard',
  },
  {
    to: '/units',
    label: (t) => t.nav.units,
    icon: IconTruck,
    isActive: (pathname) => pathname.startsWith('/units') && pathname !== '/units/new',
  },
  {
    to: '/units/new',
    label: (t) => t.nav.add,
    icon: IconPlus,
    isActive: (pathname) => pathname === '/units/new',
  },
]

function todayLabel(locale: string): string {
  const text = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' }).format(
    new Date(),
  )
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function AppLayout() {
  const [opened, { toggle, close }] = useDisclosure()
  const { pathname } = useLocation()
  const t = useT()
  const lang = useLang()

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
              aria-label={t.app.openMenu}
            />
            <Stack hiddenFrom="sm">
              <Logo compact />
            </Stack>
            <Text visibleFrom="sm" size="sm" c="dimmed">
              {todayLabel(intlLocale(lang))}
            </Text>
          </Group>

          <Group gap="xs" wrap="nowrap">
            <Badge variant="light" color="gray" radius="sm" visibleFrom="xs">
              {t.app.demoBadge}
            </Badge>
            <LangSwitch />
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
                label={item.label(t)}
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
            {t.app.demoNote}
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
