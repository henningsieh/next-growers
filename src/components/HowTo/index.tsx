import {
  Box,
  Container,
  Overlay,
  Space,
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
    zIndex: -1, // Set z-index to ensure it&apos;s behind the content
    backgroundImage: "url(diyahna-lewis-JEI-uPbp1Aw-unsplash.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "top",
  },

  container: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "top",
    alignItems: "center",
    paddingTop: theme.spacing.md,
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

export default function HowTo() {
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
        <Title className={classes.title}>How to</Title>
        <Title order={2}>🤔 How does this work? 💡</Title>
        <Space h="xl" />

        <Title order={3} mt={"xl"} mb="xs">
          Seamless Authentication
        </Title>
        <Text className={classes.description} size="lg">
          Experience hassle-free login with Growagram&apos;s magic link
          feature. No need to remember passwords or go through lengthy
          registration processes. Just click the link sent to your
          email, and you&apos;re in!
        </Text>

        <Title order={3} mt={"xl"} mb="xs">
          Effortless Search
        </Title>
        <Text className={classes.description} size="lg">
          Easily find what you&apos;re looking for with Growagram&apos;s
          powerful full-text search functionality. Quickly locate
          reports based on their headlines and text content, ensuring
          you always stay informed.
        </Text>

        <Title order={3} mt={"xl"} mb="xs">
          Strain Specific Search
        </Title>
        <Text className={classes.description} size="lg">
          Explore reports featuring specific cannabis strains with
          Growagram&apos;s strain search feature. Discover valuable
          insights and information tailored to your favorite strains.
        </Text>

        <Title order={3} mt={"xl"} mb="xs">
          Create and Manage Grows
        </Title>
        <Text className={classes.description} size="lg">
          Showcase your growing journey by creating Grows as detailed
          reports. Include parameters, header images, and utilize the
          calendar functionality to track progress effortlessly.
        </Text>

        <Title order={3} mt={"xl"} mb="xs">
          Detailed Updates
        </Title>
        <Text className={classes.description} size="lg">
          Keep your followers engaged by posting regular updates to your
          Grows. Add as many updates as needed to document each step of
          your growing process, from planting to harvesting.
        </Text>

        <Title order={3} mt={"xl"} mb="xs">
          Show Appreciation
        </Title>
        <Text className={classes.description} size="lg">
          Show your support and appreciation for other users&apos;
          reports and posts by giving them your likes. Spread positivity
          and encouragement within the Growagram community.
        </Text>

        <Title order={3} mt={"xl"} mb="xs">
          Engage with Others
        </Title>
        <Text className={classes.description} size="lg">
          Foster meaningful connections by leaving comments on other
          users&apos; posts. Share tips, ask questions, and engage in
          discussions to enhance your growing experience together.
        </Text>
      </Container>

      {/* Photo credit */}
      <Box className={classes.photoCredit}>
        <a href="https://unsplash.com/de/fotos/gruner-und-brauner-tannenzapfen-JEI-uPbp1Aw?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
          Background Image on Unsplash
        </a>
        from
        <a href="https://unsplash.com/de/@diyahna22?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
          Diyahna Lewis
        </a>
      </Box>
    </Box>
  );
}
