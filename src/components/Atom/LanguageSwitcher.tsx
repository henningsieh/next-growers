import {
  Box,
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
      <Box
        sx={(theme) => ({
          cursor: "pointer",
          border: "solid 1px ",
          borderRadius: theme.radius.sm,
          borderColor:
            theme.colorScheme === "dark"
              ? theme.colors.orange[6]
              : theme.colors.growgreen[5],
        })}
      >
        <SegmentedControl
          size="md"
          data={[
            {
              value: "de",
              label: (
                <Center>
                  <Image
                    height={16}
                    width={28}
                    src={deFlag as string}
                    alt="German Language Flag"
                  />
                </Center>
              ),
            },
            {
              value: "en",
              label: (
                <Center>
                  <Image
                    height={16}
                    width={28}
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
              ? theme.fn.lighten(theme.colors.dark[7], 0.0)
              : theme.fn.lighten(theme.colors.growgreen[4], 0.7)
          }
          onChange={() =>
            void router.push(router.pathname, router.asPath, {
              locale: i18n.language === "de" ? "en" : "de",
            })
          }
          transitionDuration={400}
        />
      </Box>
    </Group>
  );
};

export default LanguageSwitcher;
