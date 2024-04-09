import { Group, SegmentedControl } from "@mantine/core";
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
    </>
  );
};

export default LanguageSwitcher;
