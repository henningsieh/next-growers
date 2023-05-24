import { GetServerSideProps, NextPage } from "next";

import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const LanguageSwitcher: NextPage = () => {
  const router = useRouter();

  const { locales, locale: activeLocale, defaultLocale } = router;
  console.log(locales, activeLocale, defaultLocale);

  const { t, i18n } = useTranslation(activeLocale);

  return (
    <div>
      <button
        onClick={() =>
          void router.push(router.pathname, router.asPath, {
            locale: i18n.language === "de" ? "en" : "de",
          })
        }
      >
        {i18n.language === "de" ? "eng" : "de"}
        {/* {t("common:switch-language")} */}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
