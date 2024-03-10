import LightDarkButton from "../components/Atom/LightDarkButton";
import LoginPanel from "../components/SessionPanel";
import {
  Anchor,
  Box,
  Burger,
  Button,
  Center,
  Collapse,
  Divider,
  Drawer,
  Group,
  Header,
  HoverCard,
  Overlay,
  ScrollArea,
  SimpleGrid,
  Space,
  Text,
  ThemeIcon,
  UnstyledButton,
  createStyles,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronDown,
  IconMapPin,
  IconMessageCircle,
} from "@tabler/icons-react";
import { Analytics } from "@vercel/analytics/react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SpeedInsights } from "@vercel/speed-insights/next";

import { type ReactNode } from "react";

import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import LanguageSwitcher from "~/components/Atom/LanguageSwitcher";
import Notifications from "~/components/Notifications";

const useStyles = createStyles((theme) => ({
  photoCredit: {
    position: "fixed",
    bottom: theme.spacing.xs,
    left: theme.spacing.md,
    color: theme.colors.gray[7],
    textDecoration: "none",
    fontSize: 14,
    zIndex: +1,
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh", // Set the height to cover the entire viewport
    zIndex: -15,
    overflow: "hidden", // Hide overflow to prevent scrolling of the overlay
    // Conditional gradient based on theme
    background:
      theme.colorScheme === "dark"
        ? "linear-gradient(180deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.25) 90%)"
        : "linear-gradient(180deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.75) 90%)",
  },
  appBackground: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh", // Set the height to cover the entire viewport
    zIndex: -20, // Set z-index to ensure it's behind the content
    backgroundImage:
      theme.colorScheme === "dark"
        ? "url(/diyahna-lewis-JEI-uPbp1Aw-unsplash.jpg)"
        : "url(/2h-media-h9ue_EmlM7s-unsplash.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "left",
  },

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  link: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.lg,

    [theme.fn.smallerThan("sm")]: {
      height: rem(42),
      display: "flex",
      alignItems: "center",
      width: "100%",
    },

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    }),
  },

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  subLink: {
    width: "100%",
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: theme.radius.md,

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
    }),

    "&:active": theme.activeStyles,
  },

  dropdownFooter: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[0],
    margin: `calc(${theme.spacing.md} * -1)`,
    marginTop: theme.spacing.sm,
    padding: `${theme.spacing.md} calc(${theme.spacing.md} * 2)`,
    paddingBottom: theme.spacing.xl,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark"
        ? theme.colors.dark[5]
        : theme.colors.gray[1]
    }`,
  },

  hiddenIfSmallerThanXs: {
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  hiddenMobile: {
    [theme.fn.smallerThan("lg")]: {
      display: "none",
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan("lg")]: {
      display: "none",
    },
  },
}));

const externLinksMockdata = [
  {
    icon: IconMessageCircle,
    title: "CannabisAnbauen.net",
    description: "sehr gutes und freundliches deutsches Forum! 🤞",
    url: "https://forum.cannabisanbauen.net/",
  },
  {
    icon: IconMapPin,
    title: "CSC-Maps.de",
    description: "Cannabis Social Clubs in der Nähe finden!",
    url: "https://csc-maps.de/",
  } /*
  {
    icon: IconUsers,
    title: "Online Communities",
    description:
      "Join social networks and online communities dedicated to growing.",
  },
  {
    icon: IconSocial,
    title: "Social Media Groups",
    description: "Join groups on social media dedicated to growing.",
  },
  {
    icon: IconTools,
    title: "Support Groups",
    description:
      "Join support groups for growers facing common challenges.",
  },
  {
    icon: IconStar,
    title: "Interest Groups",
    description:
      "Join groups dedicated to growing specific plants or using specific techniques.",
  },*/,
];

function openUrlInNewTab(url: string) {
  window.open(url, "_blank");
}

export default function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [drawerIsOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [externLinksOpen, { toggle: toggleLinks }] =
    useDisclosure(false);
  const { classes, theme } = useStyles();

  const externLinks = externLinksMockdata.map((item) => (
    <UnstyledButton
      onClick={() => openUrlInNewTab(item.url)}
      className={classes.subLink}
      key={item.title}
    >
      <Group noWrap align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon size={rem(22)} color={theme.fn.primaryColor()} />
        </ThemeIcon>
        <Box>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" color="dimmed">
            {item.description}
          </Text>
        </Box>
      </Group>
    </UnstyledButton>
  ));

  const handleUnstyledButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    toggleLinks();
  };

  const router = useRouter();

  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const { data: session, status } = useSession();

  return (
    <>
      <Header
        height={60}
        style={{
          position: "fixed",
          zIndex: 100,
          maxWidth: 1440, //same as <Container size="xl" />
          width: "100%",
          margin: "0px auto",
          padding: "0 1rem",
        }}
      >
        <Group position="apart" sx={{ height: "100%" }}>
          <Group ml={0}>
            <Box className={classes.hiddenDesktop}>
              <Burger
                p={0}
                m={0}
                size={36}
                opened={drawerIsOpened}
                onClick={toggleDrawer}
              />
            </Box>
            <Link href="/grows">
              <Image
                className="rounded-sm"
                width={86}
                height={44}
                alt="GrowAGram Logo"
                src="/growagram-logo-wide-magenta-gradient.png"
              />
            </Link>
          </Group>
          <Group
            sx={{ height: "100%" }}
            spacing={0}
            className={classes.hiddenMobile}
          >
            <Link href="/" className={classes.link}>
              {t("common:app-headermenu-welcome")}
            </Link>
            <Link href="/grows" className={classes.link}>
              {t("common:app-headermenu-explore")}
            </Link>
            <Link
              href="/how-to-manual-anleitung-wie-geht-das"
              className={classes.link}
            >
              {t("common:app-headermenu-how-to")}
            </Link>
            <HoverCard
              width={600}
              position="bottom"
              radius="md"
              shadow="md"
              withinPortal
            >
              <HoverCard.Target>
                <a href="#" className={classes.link}>
                  <Center inline>
                    <Box component="span" mr={5}>
                      Extern
                    </Box>
                    <IconChevronDown
                      size={16}
                      color={theme.fn.primaryColor()}
                    />
                  </Center>
                </a>
              </HoverCard.Target>

              <HoverCard.Dropdown sx={{ overflow: "hidden" }}>
                <Group position="apart" px="md">
                  <Text fw={500}>Community</Text>
                  <Anchor href="#" fz="xs">
                    View all
                  </Anchor>
                </Group>

                <Divider
                  my="sm"
                  mx="-md"
                  color={
                    theme.colorScheme === "dark" ? "dark.5" : "gray.1"
                  }
                />

                <SimpleGrid cols={2} spacing={0}>
                  {externLinks}
                </SimpleGrid>

                <Box className={classes.dropdownFooter}>
                  <Group position="apart">
                    <Box>
                      <Text fw={500} fz="sm">
                        Get started
                      </Text>
                      <Text size="xs" color="dimmed">
                        Their food sources have decreased, and their
                        numbers
                      </Text>
                    </Box>
                    <Button variant="default">Get started</Button>
                  </Group>
                </Box>
              </HoverCard.Dropdown>
            </HoverCard>
          </Group>
          <Group>
            <Box className={classes.hiddenIfSmallerThanXs}>
              {" "}
              {/* Does not fit in mobile portrait mode display */}
              <LanguageSwitcher />
            </Box>
            <Box>
              <LightDarkButton />
            </Box>
            {!!session && status === "authenticated" && (
              <Box>
                <Notifications />
              </Box>
            )}
            <LoginPanel />
          </Group>
          {/* <Burger opened={drawerOpened} onClick={toggleDrawer} className={classes.hiddenDesktop} /> */}
        </Group>
      </Header>
      <Drawer
        opened={drawerIsOpened}
        onClose={closeDrawer}
        size="100%"
        // padding="md"
        title="Navigation"
        className={classes.hiddenDesktop}
        zIndex={100}
      >
        <ScrollArea
          onClick={closeDrawer} // -> menu self close on item click
          h={`calc(100vh - ${rem(60)})`}
          mx="-md"
          mt="-md"
        >
          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />

          <Link href="/" className={classes.link}>
            {t("common:app-headermenu-welcome")}
          </Link>
          <Link href="/grows" className={classes.link}>
            {t("common:app-headermenu-explore")}
          </Link>
          <Link
            href="/how-to-manual-anleitung-wie-geht-das"
            className={classes.link}
          >
            {t("common:app-headermenu-how-to")}
          </Link>
          <UnstyledButton
            className={classes.link}
            onClick={handleUnstyledButtonClick}
          >
            <Center inline>
              <Box component="span" mr={5}>
                Extern
              </Box>
              <IconChevronDown
                size={16}
                color={theme.fn.primaryColor()}
              />
            </Center>
          </UnstyledButton>

          <Collapse in={externLinksOpen}>{externLinks}</Collapse>

          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />
        </ScrollArea>
      </Drawer>

      {/* Background image */}
      <Box className={classes.appBackground} />

      {/* Overlay */}
      <Overlay
        className={classes.overlay}
        opacity={1}
        // gradient={
        //   theme.colorScheme === "dark"
        //     ? "linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
        //     : "linear-gradient(180deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.65) 40%)"
        // }
      />

      {/* Content */}
      <Box className="relative mt-16">
        {children}
        <Analytics />
        <SpeedInsights />
      </Box>
      <Space h="xl" />
      <Space h="xl" />
      <Space h="xl" />

      {/* Photo credit */}
      <Box className={classes.photoCredit}>
        <u>
          <a
            target="_blank"
            href="https://unsplash.com/de/fotos/gruner-und-brauner-tannenzapfen-JEI-uPbp1Aw?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
          >
            Background Image on Unsplash
          </a>
        </u>{" "}
        from{" "}
        <u>
          <a
            target="_blank"
            href="https://unsplash.com/de/@diyahna22?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
          >
            Diyahna Lewis
          </a>
        </u>{" "}
      </Box>
    </>
  );
}
