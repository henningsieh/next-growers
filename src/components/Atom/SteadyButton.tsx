import {
  Box,
  Button,
  Image,
  rem,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { env } from "~/env.mjs";

import React from "react";
import { useTranslation } from "react-i18next";

import Link from "next/link";
import { useRouter } from "next/router";

import { Locale } from "~/types";

function SteadyButton() {
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <Box pt={6}>
      <Link target="_blank" href={env.NEXT_PUBLIC_STEADY_URL}>
        <Button
          p={0}
          h={34}
          radius="xs"
          variant="outline"
          color={dark ? "gray.5" : "gray.7 "}
          className="overflow-hidden cursor-pointer"
          title={t("common:app-steady-button-title")}
        >
          <Image
            alt="GrowAGram auf Steady unterstützen"
            height={60}
            p={0}
            width={
              useMediaQuery(`(min-width: ${theme.breakpoints.xs})`)
                ? rem(110)
                : rem(50)
            }
            src={
              useMediaQuery(`(min-width: ${theme.breakpoints.xs})`)
                ? activeLocale === Locale.DE
                  ? "/steady/member_DE3.png"
                  : "/steady/member_EN3.png"
                : "/steady/icon-in-circle.png"
            }
          />
        </Button>
      </Link>
    </Box>
  );
}

export default SteadyButton;
