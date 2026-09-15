import { Link } from "react-router-dom";
import { Button, Stack, Text, Title } from "@mantine/core";

export function NotFoundPage() {
  return (
    <Stack align="flex-start" gap="sm">
      <Title order={2}>Страница не найдена</Title>
      <Text c="dimmed">Проверьте адрес — такой страницы нет.</Text>
      <Button component={Link} to="/units">
        К списку техники
      </Button>
    </Stack>
  );
}
