import {
  Box,
  Button,
  Container,
  createStyles,
  Grid,
  Group,
  rem,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { LoginModal } from "~/components/Atom/LoginModal";
import ReportCard from "~/components/Report/Card";

import type { IsoReportWithPostsFromDb } from "~/types";

interface LandingPageProps {
  topLikeReports: IsoReportWithPostsFromDb[];
}

export default function LandingPage({
  topLikeReports: isoReports,
}: LandingPageProps) {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

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
      fontFamily: `'Roboto Slab', sans-serif`,
      fontSize: rem(112),
      fontWeight: 700,
      lineHeight: 0.8,
      paddingTop: 12,
      paddingBottom: 12,

      [theme.fn.smallerThan("lg")]: {
        fontSize: rem(112),
      },

      [theme.fn.smallerThan("md")]: {
        fontSize: rem(92),
      },

      [theme.fn.smallerThan("sm")]: {
        fontSize: rem(54),
      },
    },
    subTitle: {
      // fontFamily: `'Lato', sans-serif`,
      fontSize: rem(54),
      fontWeight: 900,
      lineHeight: 1.5,
      paddingTop: 12,
      paddingBottom: 12,
      textShadow: dark
        ? `2px 3px 6px rgba(255, 83, 34, 0.8)`
        : `1px 2px 2px rgba(29, 75, 20, 0.9)`,

      [theme.fn.smallerThan("lg")]: {
        fontSize: rem(54),
        lineHeight: 1.4,
      },

      [theme.fn.smallerThan("md")]: {
        fontSize: rem(44),
        lineHeight: 1.3,
      },

      [theme.fn.smallerThan("sm")]: {
        fontSize: rem(24),
        lineHeight: 1.2,
      },
    },

    description: {
      textAlign: "center",

      [theme.fn.smallerThan("sm")]: {
        fontSize: theme.fontSizes.md,
      },
    },
  }));

  const { classes, theme } = useStyles();
  const smallScreen = useMediaQuery(
    `(max-width: ${theme.breakpoints.lg})`
  );
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
          size="xl"
          className={classes.container}
        >
          <Text
            className={classes.title}
            variant="gradient"
            gradient={{
              from: theme.fn.lighten(theme.colors.growgreen[4], 0.01),
              to: theme.fn.darken(theme.colors.groworange[4], 0.01),
              deg: 90,
            }}
          >
            GrowAGram
          </Text>

          <Title order={2} className={classes.subTitle}>
            🪴 Track Your Grow! 📜
          </Title>

          {smallScreen && (
            <Group position="center">
              <Button
                variant="default"
                onClick={() => {
                  void router.push("/grows");
                }}
                className="text-lg uppercase cursor-default my-4 h-12 w-72 
              bg-gradient-to-r transition duration-300 ease-in-out 
              from-orange-600 via-pink-600 to-red-500 text-white
              hover:from-orange-700 hover:via-pink-700 hover:to-red-600"
              >
                {t("common:landing-button-allgrows")} 🔎
              </Button>

              <Button
                variant="default"
                onClick={() => {
                  status === "authenticated"
                    ? void router.push("/account/grows/create")
                    : open();
                }}
                className="text-lg uppercase cursor-default my-4 h-12 w-72 
              bg-gradient-to-r transition duration-1000 ease-in-out 
              from-teal-700  via-green-600  to-emerald-800 
              hover:from-teal-800 hover:via-green-700 hover:to-emerald-700"
              >
                {t("common:usermenu-addnewgrow")} ⛏️
              </Button>
            </Group>
          )}

          {/* <Flex justify="flex-end" align="center"> */}
          {/* LOOP OVER REPORTS topLikeReports */}
          <Grid gutter="xs">
            {/* LOOP OVER REPORTS */}
            {isoReports.length
              ? isoReports.map((isoReport) => {
                  return (
                    <Grid.Col
                      className="scale-90"
                      key={isoReport.id}
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={3}
                    >
                      <ReportCard report={isoReport} />
                    </Grid.Col>
                  );
                })
              : null}
          </Grid>

          {!smallScreen && (
            <Group position="center">
              <Button
                variant="default"
                onClick={() => {
                  void router.push("/grows");
                }}
                className="text-lg uppercase cursor-default my-4 h-12 w-72 
              bg-gradient-to-r transition duration-300 ease-in-out 
              from-orange-600 via-pink-600 to-red-500 text-white
              hover:from-orange-700 hover:via-pink-700 hover:to-red-600"
              >
                {t("common:landing-button-allgrows")} 🔎
              </Button>

              <Button
                variant="default"
                onClick={() => {
                  status === "authenticated"
                    ? void router.push("/account/grows/create")
                    : open();
                }}
                className="text-lg uppercase cursor-default my-4 h-12 w-72 
              bg-gradient-to-r transition duration-1000 ease-in-out 
              from-teal-700  via-green-600  to-emerald-800 
              hover:from-teal-800 hover:via-green-700 hover:to-emerald-700"
              >
                {t("common:usermenu-addnewgrow")} ⛏️
              </Button>
            </Group>
          )}

          <Text className={classes.description} size="xl" mt="xl">
            {t("common:landing-text-top1")}
          </Text>

          <Text className={classes.description} size="xl" mt="sm">
            {t("common:landing-text-top3")}
          </Text>

          <Text className={classes.description} size="xl" mt="xl">
            {t("common:landing-text-top2")}
          </Text>

          <Text className={classes.description} size="md" mt="xl">
            {t("common:landing-text-bottom")}
          </Text>
        </Container>
      </Box>
    </>
  );
}
