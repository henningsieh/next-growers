import {
  ActionIcon,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { GetServerSideProps, NextPage } from "next";

import Image from "next/image";
import React from "react";
import deFlag from "../../../public/DE.svg";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import usFlag from "../../../public/US.svg";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const LanguageSwitcher: NextPage = () => {
  const router = useRouter();

  const { locales, locale: activeLocale, defaultLocale } = router;
  console.log(locales, activeLocale, defaultLocale);

  const { t, i18n } = useTranslation(activeLocale);

  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const dark = colorScheme === "dark";

  return (
    <>
      <ActionIcon
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
      </ActionIcon>
    </>
  );
};

export default LanguageSwitcher;
