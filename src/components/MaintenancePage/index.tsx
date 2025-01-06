import { Container, Stack, Text, Title } from "@mantine/core";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

export default function MaintenancePage() {
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  return (
    <Container
      size="md"
      className="flex h-screen items-center justify-center"
      onClick={(e) => e.preventDefault()}
      onKeyDown={(e) => e.preventDefault()}
      style={{ pointerEvents: "none" }}
    >
      <Stack align="center" spacing="xl">
        <Title order={1} size="h1">
          {t("common:maintenance_mode")}
        </Title>
        <Text size="xl" align="center">
          {t("common:maintenance_message")}
        </Text>
        <Text size="lg" align="center">
          {t("common:maintenance_return_time")}
        </Text>
      </Stack>
    </Container>
  );
}
