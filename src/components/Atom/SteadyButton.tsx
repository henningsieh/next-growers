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

import { useTranslation } from "next-i18next";
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
          h={32}
          radius="xs"
          variant="outline"
          color={dark ? "red.5" : "growgreen.2 "}
          className="overflow-hidden cursor-pointer"
          title={t("common:app-steady-button-title")}
        >
          <Image
            alt="GrowAGram auf Steady unterstützen"
            height={
              useMediaQuery(`(min-width: ${theme.breakpoints.xs})`)
                ? rem(68)
                : rem(42)
            }
            p={0}
            width={
              useMediaQuery(`(min-width: ${theme.breakpoints.xs})`)
                ? rem(120)
                : rem(42)
            }
            src={
              useMediaQuery(`(min-width: ${theme.breakpoints.xs})`)
                ? activeLocale === Locale.DE
                  ? "/steady/member_DE3.png"
                  : "/steady/member_EN3.png"
                : "/steady/dark.svg"
            }
          />
        </Button>
      </Link>
    </Box>
  );
}

export default SteadyButton;
