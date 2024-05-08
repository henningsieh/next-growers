import {
  Center,
  Group,
  SegmentedControl,
  useMantineTheme,
} from "@mantine/core";
import deFlag from "public/svg/DE.svg";
import usFlag from "public/svg/US.svg";

import type { NextPage } from "next";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useRouter } from "next/router";

const LanguageSwitcher: NextPage = () => {
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t, i18n } = useTranslation(activeLocale);

  const theme = useMantineTheme();
  const switchLabel = t("common:app-switchlanguage");

  return (
    <Group title={switchLabel} position="center">
      <SegmentedControl
        value={activeLocale}
        size="md"
        data={[
          {
            value: "de",
            label: (
              <Center p={2}>
                <Image
                  height={22}
                  width={24}
                  src={deFlag as string}
                  alt="German Language Flag"
                />
              </Center>
            ),
          },
          {
            value: "en",
            label: (
              <Center p={2}>
                <Image
                  height={22}
                  width={24}
                  src={usFlag as string}
                  alt="English Language Flag"
                />
              </Center>
            ),
          },
        ]}
        color={theme.colorScheme === "dark" ? "dark.4" : "gray.3"}
        bg={
          theme.colorScheme === "dark"
            ? theme.fn.darken(theme.colors.dark[5], 0.2)
            : theme.fn.lighten(theme.colors.growgreen[4], 0.7)
        }
        onChange={() =>
          void router.replace(router.pathname, router.asPath, {
            locale: i18n.language === "de" ? "en" : "de",
          })
        }
        transitionDuration={250}
      />
    </Group>
  );
};

export default LanguageSwitcher;
