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
    backgroundPosition: "center",
  },

  container: {
    // height: rem(800),
    height: "calc(100vh)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: `calc(${theme.spacing.xl} * 6)`,
    zIndex: 1,
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
    // maxWidth: 860,

    [theme.fn.smallerThan("sm")]: {
      maxWidth: "96%",
      fontSize: theme.fontSizes.md,
    },
  },

  control: {
    marginTop: `calc(${theme.spacing.xl} * 1.5)`,

    [theme.fn.smallerThan("sm")]: {
      width: "80%",
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
        <Title className={classes.title}>GrowAGram.com</Title>
        <Title pb={20} order={2}>
          🪴 Show Your Grow! 🚀
        </Title>
        <Text className={classes.description} size="xl" mt="xl">
          {t("common:landing-text1")}
        </Text>
        <Text className={classes.description} size="xl" mt="xl">
          {t("common:landing-text2")}
        </Text>
        <Link href="/reports">
          <button
            className="my-8 h-12 w-96 rounded-md bg-gradient-to-r
          from-pink-600 via-red-600 to-orange-500 text-white"
          >
            EXPLORE REPORTS 🔎
          </button>
        </Link>
        <Text className={classes.description} size="md">
          {t("common:landing-text3")}
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
