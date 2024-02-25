import {
  Box,
  Container,
  Overlay,
  Text,
  Title,
  createStyles,
  rem,
} from "@mantine/core";

import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
  hero: {
    position: "relative",
    backgroundImage: "url(diyahna-lewis---JxxyIUHnU-unsplash.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "top",
  },

  container: {
    // height: rem(800),
    height: "calc(90vh)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "top",
    alignItems: "center",
    paddingBottom: `calc(${theme.spacing.xl} * 6)`,
    zIndex: 99,
    position: "relative",

    [theme.fn.smallerThan("sm")]: {
      height: rem(900),
      flexDirection: "column",
      justifyContent: "center",
      paddingBottom: `calc(${theme.spacing.xl} * 3)`,
    },
  },

  title: {
    color: theme.white,
    fontSize: rem(48),
    fontWeight: 900,
    lineHeight: 1.1,
    paddingTop: 12,
    paddingBottom: 12,

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(42),
      lineHeight: 1.2,
    },

    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(36),
      lineHeight: 1.3,
    },
  },

  description: {
    color: theme.white,
    textAlign: "center",

    [theme.fn.smallerThan("sm")]: {
      fontSize: theme.fontSizes.md,
    },
  },
}));

export default function LandingCard() {
  const { classes } = useStyles();

  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  return (
    <Box className={classes.hero}>
      <Overlay
        opacity={1}
        zIndex={0}
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
      />
      <Container size="md" className={classes.container}>
        <Title className={classes.title}>GrowAGram</Title>
        <Title order={2}>🪴 Show Your Grow! 🚀</Title>
        <Text className={classes.description} size="xl" mt="xl">
          {t("common:landing-text-top1")}
        </Text>
        <Link href="/grows">
          <button
            className="my-8 h-12 w-96 rounded-md bg-gradient-to-r
          from-pink-600 via-red-600 to-orange-500 text-white"
          >
            EXPLORE ALL GROWS 🔎
          </button>
        </Link>
        <Text className={classes.description} size="xl" mb="sm">
          {t("common:landing-text-top2")}
        </Text>
        <Text className={classes.description} size="md" mt="xl">
          {t("common:landing-text-bottom")}
        </Text>
      </Container>
      Foto von{" "}
      <a href="https://unsplash.com/@diyahna22?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
        Diyahna Lewis
      </a>{" "}
      auf{" "}
      <a href="https://unsplash.com/de/fotos/--JxxyIUHnU?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
        Unsplash
      </a>
    </Box>
  );
}
