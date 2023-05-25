import {
  ActionIcon,
  Group,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons-react";

import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

export default function LightDarkButton() {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const dark = colorScheme === "dark";
  const router = useRouter();
  const { locales, locale: activeLocale, defaultLocale } = router;
  const { t, i18n } = useTranslation(activeLocale);

  return (
    <Group position="center" my={0}>
      <ActionIcon
        className="cursor-default"
        size={32}
        variant="outline"
        color={dark ? theme.primaryColor : "grape"}
        onClick={() => toggleColorScheme()}
        title={t("common:app-themetoggle")}
      >
        {dark ? <IconSun size="1.4rem" /> : <IconMoonStars size="1.4rem" />}
      </ActionIcon>
    </Group>
  );
}
