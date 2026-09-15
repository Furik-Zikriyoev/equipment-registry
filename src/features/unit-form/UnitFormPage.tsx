import { useParams } from "react-router-dom";
import { Title } from "@mantine/core";

export function UnitFormPage() {
  const { id } = useParams();

  return (
    <Title order={2}>
      {id ? `Редактирование: ${id}` : "Новая единица техники"}
    </Title>
  );
}
