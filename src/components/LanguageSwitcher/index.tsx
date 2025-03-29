import {
  Center,
  createStyles,
  Group,
  SegmentedControl,
} from "@mantine/core";
import deFlag from "public/svg/DE.svg";
import usFlag from "public/svg/US.svg";

import type { NextPage } from "next";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useRouter } from "next/router";

const useStyles = createStyles(() => ({
  flagImage: {
    width: "1.5rem",
    height: "1rem",
    borderRadius: "2px",
  },
}));

const LanguageSwitcher: NextPage = () => {
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t, i18n } = useTranslation(activeLocale);
  const { classes } = useStyles();

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
              <Center>
                <Image
                  className={classes.flagImage}
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
                  className={classes.flagImage}
                  src={usFlag as string}
                  alt="English Language Flag"
                />
              </Center>
            ),
          },
        ]}
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
