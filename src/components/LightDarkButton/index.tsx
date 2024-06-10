import {
  ActionIcon,
  Group,
  useMantineColorScheme,
} from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons-react";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

export default function LightDarkButton() {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  return (
    <Group position="center" my={0}>
      <ActionIcon
        className="cursor-default"
        size={32}
        variant="subtle"
        color={dark ? "orange.6" : "growgreen.5 "}
        onClick={() => toggleColorScheme()}
        title={t("common:app-themetoggle")}
      >
        {dark ? (
          <IconSun size={28} stroke={2.2} />
        ) : (
          <IconMoonStars size={28} stroke={1.8} />
        )}
      </ActionIcon>
    </Group>
  );
}
