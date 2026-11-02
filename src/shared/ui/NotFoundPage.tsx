import { Link } from 'react-router-dom'
import { Button, Group, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { IconArrowLeft, IconRoadSign } from '@tabler/icons-react'

import { usePageTitle } from '../lib/usePageTitle'

export function NotFoundPage() {
  usePageTitle('Страница не найдена')

  return (
    <Stack align="center" gap="md" py={80} ta="center">
      <ThemeIcon size={72} radius="xl" variant="light" color="brand">
        <IconRoadSign size={36} stroke={1.6} />
      </ThemeIcon>
      <Text ff="monospace" c="dimmed" fw={600}>
        404
      </Text>
      <Title order={1} fz={{ base: 26, sm: 32 }} fw={800}>
        Такой страницы нет
      </Title>
      <Text c="dimmed" maw={420}>
        Возможно, ссылка устарела или в адресе опечатка. Вернитесь к обзору парка или к списку техники.
      </Text>
      <Group gap="sm" mt="sm">
        <Button component={Link} to="/dashboard" leftSection={<IconArrowLeft size={16} />}>
          К обзору парка
        </Button>
        <Button component={Link} to="/units" variant="default">
          Вся техника
        </Button>
      </Group>
    </Stack>
  )
}
