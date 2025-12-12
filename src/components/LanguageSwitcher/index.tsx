import {
  Center,
  createStyles,
  Group,
  SegmentedControl,
} from "@mantine/core";

// Use images from the `public/` folder via absolute paths

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
                  src="/svg/DE.svg"
                  alt="German Language Flag"
                  width={24}
                  height={16}
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
                  src="/svg/US.svg"
                  alt="English Language Flag"
                  width={24}
                  height={16}
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
