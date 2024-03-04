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
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh", // Set the height to cover the entire viewport
    zIndex: 0,
    overflow: "hidden", // Hide overflow to prevent scrolling of the overlay
  },

  backgroundImage: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh", // Set the height to cover the entire viewport
    zIndex: -1, // Set z-index to ensure it's behind the content
    backgroundImage: "url(diyahna-lewis-JEI-uPbp1Aw-unsplash.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "top",
  },

  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "top",
    alignItems: "center",
    paddingTop: theme.spacing.md,
    position: "relative",

    // [theme.fn.smallerThan("sm")]: {
    //   // height: rem(900),
    //   // flexDirection: "column",
    //   //justifyContent: "center",
    //   //paddingBottom: `calc(${theme.spacing.xl} * 3)`,
    // },
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

  photoCredit: {
    position: "fixed",
    bottom: theme.spacing.md,
    left: theme.spacing.md,
    color: theme.colors.gray[7],
    textDecoration: "none",
  },
}));

export default function LandingPage() {
  const { classes } = useStyles();

  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  return (
    <Box>
      {/* Background image */}
      <Box className={classes.backgroundImage} />

      {/* Overlay */}
      <Overlay
        className={classes.overlay} // Apply the overlay style class
        opacity={1}
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
      />

      <Container size="lg" className={classes.container}>
        <Title className={classes.title}>GrowAGram</Title>
        <Title order={2}>🪴 Show Your Grow! 🚀</Title>

        <Text className={classes.description} size="xl" mt="xl">
          {t("common:landing-text-top1")}
        </Text>

        <Text className={classes.description} size="xl" mt="sm">
          {t("common:landing-text-top2")}
        </Text>

        <Link href="/grows">
          <button
            className="uppercase my-8 h-12 w-72 rounded-md bg-gradient-to-r
          from-orange-600 via-pink-600 to-red-500 text-white"
          >
            {t("common:landing-button-text")} 🔎
          </button>
        </Link>

        <Text className={classes.description} size="md" mt="xl">
          {t("common:landing-text-bottom")}
        </Text>
      </Container>

      {/* Photo credit */}
      <Box className={classes.photoCredit}>
        <a href="https://unsplash.com/de/fotos/gruner-und-brauner-tannenzapfen-JEI-uPbp1Aw?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
          Background Image on Unsplash
        </a>{" "}
        from{" "}
        <a href="https://unsplash.com/de/@diyahna22?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
          Diyahna Lewis
        </a>{" "}
      </Box>
    </Box>
  );
}
