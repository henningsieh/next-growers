import {
  ActionIcon,
  Box,
  createStyles,
  Flex,
  rem,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { IconBrandInstagram, IconBrandX } from "@tabler/icons-react";
import { env } from "~/env.mjs";

import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
  footer: {
    paddingTop: rem(24),
    marginBottom: rem(42),
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.colors.gray[3]
    }`,
  },
}));
// Define the type for the props

// Define the Footer component with the correct props type
export function Footer() {
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const footerLinks = [
    {
      link: "/tos",
      label: t("common:app-impressum-tos-label-short"),
    },
    {
      link: "/imprint",
      label: t("common:app-impressum-imprint-label"),
    },
    {
      link: "/privacy",
      label: t("common:app-impressum-privacy-label"),
    },
  ];

  const footerCenterItems = footerLinks.map((link) => (
    <Link key={link.label} href={link.link}>
      <Text lh={0.6} size="md">
        {link.label}
      </Text>
    </Link>
  ));

  const { classes, theme: theme } = useStyles();

  return (
    <Box className={classes.footer}>
      <Flex
        align="center"
        justify="space-between"
        p={theme.spacing.xs}
        gap={theme.spacing.md}
      >
        <ThemeIcon>
          <Image
            priority
            src={"/favicon-32x32.png"}
            width={32}
            height={32}
            alt={"GrowAGram Icon"}
          />
        </ThemeIcon>

        <Flex gap="sm" justify="center" wrap="wrap">
          {footerCenterItems}
        </Flex>

        <Flex gap="sm" justify="flex-end" wrap="nowrap">
          <Link target="_blank" href={env.NEXT_PUBLIC_TWITTERX_URL}>
            <ActionIcon
              title="Twitter/X [extern]"
              className="cursor-pointer"
              size="lg"
              variant="default"
              radius="xl"
            >
              <IconBrandX
                style={{ width: rem(18), height: rem(18) }}
                stroke={1.5}
              />
            </ActionIcon>
          </Link>
          {/* <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandYoutube
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </ActionIcon> */}
          <Link target="_blank" href={env.NEXT_PUBLIC_INSTAGRAM_URL}>
            <ActionIcon
              title="Instagram [extern]"
              className="cursor-pointer"
              size="lg"
              variant="default"
              radius="xl"
            >
              <IconBrandInstagram
                style={{ width: rem(18), height: rem(18) }}
                stroke={1.5}
              />
            </ActionIcon>
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
}
