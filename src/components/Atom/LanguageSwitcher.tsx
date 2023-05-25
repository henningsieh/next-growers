import {
  ActionIcon,
  Box,
  Center,
  Group,
  SegmentedControl,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { GetServerSideProps, NextPage } from "next";
import { IconMoon, IconSun } from "@tabler/icons-react";

import Image from "next/image";
import React from "react";
import deFlag from "../../../public/DE.svg";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import usFlag from "../../../public/US.svg";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const LanguageSwitcher: NextPage = () => {
  const { colorScheme } = useMantineColorScheme();

  const router = useRouter();
  const { locales, locale: activeLocale, defaultLocale } = router;
  const { t, i18n } = useTranslation(activeLocale);
  const switchLabel = t("common:app-switchlanguage");
  return (
    <>
      <Group title={switchLabel} position="center">
        <SegmentedControl
          bottom={0}
          variant="filled"
          value={router.locale}
          onChange={() =>
            void router.push(router.pathname, router.asPath, {
              locale: i18n.language === "de" ? "en" : "de",
            })
          }
          data={[
            {
              value: "de",
              label: (
                <Image
                  height={12}
                  width={28}
                  alt="German language icon"
                  src={deFlag as string}
                />
              ),
            },
            {
              value: "en",
              label: (
                <Image
                  height={12}
                  width={28}
                  alt="German language icon"
                  src={usFlag as string}
                />
              ),
            },
          ]}
        />
      </Group>
      {/* 
      <ActionIcon
        title="Toggle Language (en/de)"
        className="cursor-default"
        size={32}
        variant="transparent"
        color={dark ? theme.primaryColor : "grape"}
        onClick={() =>
          void router.push(router.pathname, router.asPath, {
            locale: i18n.language === "de" ? "en" : "de",
          })
        }
      >
        <Image
          height={12}
          width={28}
          alt="German language icon"
          src={(i18n.language === "de" ? usFlag : deFlag) as string}
        />
      </ActionIcon> */}
    </>
  );
};

export default LanguageSwitcher;
