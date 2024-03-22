import { LoginModal } from "../Atom/LoginModal";
import {
  Box,
  Button,
  Container,
  Text,
  Title,
  createStyles,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
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
    textAlign: "center",

    [theme.fn.smallerThan("sm")]: {
      fontSize: theme.fontSizes.md,
    },
  },
}));

export default function LandingPage() {
  const { classes } = useStyles();

  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);
  const { status: status } = useSession();

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <LoginModal opened={opened} close={close} />

      <Box>
        <Container
          mb={"xl"}
          pb={"xl"}
          size="lg"
          className={classes.container}
        >
          <Title className={classes.title}>GrowAGram</Title>
          <Title order={2}>🪴 Show Your Grow! 🚀</Title>

          <Text className={classes.description} size="xl" mt="xl">
            {t("common:landing-text-top1")}
          </Text>

          <Text className={classes.description} size="xl" mt="sm">
            {t("common:landing-text-top3")}
          </Text>

          <Button
            onClick={() => {
              void router.push("/grows");
            }}
            className="
              text-lg uppercase 
              my-4 h-12 w-72 rounded-md 
              bg-gradient-to-r from-orange-600 via-pink-600 to-red-500 text-white"
          >
            {t("common:landing-button-allgrows")} 🔎
          </Button>

          <Text className={classes.description} size="xl" mt="xl">
            {t("common:landing-text-top2")}
          </Text>

          <Button
            onClick={() => {
              status === "authenticated"
                ? void router.push("/account/grows/create")
                : open();
            }}
            className="
              text-lg uppercase cursor-default
              my-4 h-12 w-72 rounded-md 
              bg-gradient-to-r from-teal-700  via-green-600  to-emerald-800 text-white"
          >
            {t("common:usermenu-addnewgrow")} ⛏️
          </Button>

          <Text className={classes.description} size="md" mt="xl">
            {t("common:landing-text-bottom")}
          </Text>
        </Container>
      </Box>
    </>
  );
}
