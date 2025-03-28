import {
  Anchor,
  Box,
  Burger,
  Center,
  Collapse,
  createStyles,
  Divider,
  Drawer,
  Group,
  Header,
  HoverCard,
  Image,
  Overlay,
  rem,
  ScrollArea,
  SimpleGrid,
  Text,
  ThemeIcon,
  UnstyledButton,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronDown,
  IconMapPin,
  IconMessageCircle,
} from "@tabler/icons-react";
import {
  SupporterModalProvider,
  useSupporterModal,
} from "~/contexts/SupporterModalContext";

import { useEffect } from "react";

import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";

import CookieConsentBanner from "~/components/Atom/CookieConsent";
import { Footer } from "~/components/Atom/Footer";
import SteadyButton from "~/components/Atom/SteadyButton";
import { SupporterWelcomeModal } from "~/components/Atom/SupporterWelcomeModal";
import LanguageSwitcher from "~/components/LanguageSwitcher";
import LightDarkButton from "~/components/LightDarkButton";
import AcceptedTOS from "~/components/User/AcceptedTOS";
import Notifications from "~/components/User/Notifications";
import LoginPanel from "~/components/User/SessionPanel";

import { shouldShowSupporterModal } from "~/utils/modalUtils";

const useStyles = createStyles((theme) => ({
  photoCredit: {
    position: "fixed",
    bottom: theme.spacing.xs,
    left: theme.spacing.md,
    color: theme.colors.gray[7],
    textDecoration: "none",
    fontSize: 14,
    zIndex: -10,
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
        ? "linear-gradient(                           \
            45deg,                                    \
            rgba(0, 0, 0, 0.75) 50%,                  \
            rgba(0, 0, 0, 0.25) 90%)"
        : "linear-gradient(                           \
            225deg,                                   \
            rgba(255, 255, 255, 0.25) 0%,             \
            rgba(255, 255, 255, 0.75) 90%)",
  },
  appBackground: {
    position: "fixed",
    top: 0,
    // left: 0,
    backgroundSize: "cover",
    backgroundPosition: "left",
    width: "100%",
    height: "100vh",
    zIndex: -20,
    backgroundImage:
      theme.colorScheme === "dark"
        ? "url(/background-dark.webp)"
        : "url(/background-light.webp)",
  },

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  link: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.white
        : theme.colors.growgreen[6],
    fontWeight: 700,
    fontSize: theme.fontSizes.lg,

    [theme.fn.smallerThan("sm")]: {
      height: rem(42),
      display: "flex",
      alignItems: "center",
      width: "100%",
    },

    ...theme.fn.hover({
      color: theme.white,
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.growgreen[6]
          : theme.colors.growgreen[4],
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
          : theme.colors.growgreen[3],
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.white,
    }),

    "&:active": theme.activeStyles,
  },

  dropdownFooter: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
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
    [theme.fn.smallerThan("sm")]: {
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

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const [drawerIsOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [externLinksOpen, { toggle: toggleLinks }] =
    useDisclosure(false);
  const { classes, theme } = useStyles();
  const { isModalOpen, openModal, closeModal } = useSupporterModal();

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

  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  // Check if we should show the supporter modal on component mount
  useEffect(() => {
    // Only show after a delay of 1s to ensure page has loaded
    const timer = setTimeout(() => {
      if (shouldShowSupporterModal()) {
        openModal();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [openModal]);

  const externLinks = externLinksMockdata.map((item) => (
    <UnstyledButton
      bg={dark ? "dark.5" : "gray.2"}
      onClick={() => openUrlInNewTab(item.url)}
      className={classes.subLink}
      key={item.title}
    >
      <Group noWrap align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon size={22} color={theme.colors.growgreen[4]} />
        </ThemeIcon>
        <Box>
          <Text size="md" fw={500}>
            {item.title}
          </Text>
          <Text size="sm" color="dimmed">
            {item.description}
          </Text>
        </Box>
      </Group>
    </UnstyledButton>
  ));

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
                size={34}
                opened={drawerIsOpened}
                onClick={toggleDrawer}
                color={
                  dark
                    ? theme.colors.orange?.[7]
                    : theme.colors.growgreen?.[4]
                }
              />
            </Box>
            <Link href="/grows">
              <Image
                mb="xs"
                width={75}
                height={50}
                // quality={100}
                alt="GrowAGram Logo"
                src="/grow-a-gram-high-resolution-logo.webp"
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
            {!!session && status === "authenticated" && (
              <Link href="/account/grows" className={classes.link}>
                {t("common:usermenu-mygrows")}
              </Link>
            )}
            <Link href="/info/tech-stack" className={classes.link}>
              Technologie
            </Link>
            {/* <Link
              href="/how-to-manual-anleitung-wie-geht-das"
              className={classes.link}
            >
              {t("common:app-headermenu-how-to")}
            </Link> */}
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
                    {/* View all */}
                  </Anchor>
                </Group>

                <Divider
                  my="sm"
                  mx="-md"
                  color={
                    theme.colorScheme === "dark" ? "dark.5" : "gray.1"
                  }
                />

                <SimpleGrid cols={2} spacing="lg">
                  {externLinks}
                </SimpleGrid>

                <Box className={classes.dropdownFooter}>
                  {/* <Group position="apart">
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
                  </Group> */}
                </Box>
              </HoverCard.Dropdown>
            </HoverCard>
          </Group>
          <Group>
            <Box>
              <SteadyButton />
            </Box>
            {/* Does not fit in mobile portrait mode display */}
            <Box className={classes.hiddenIfSmallerThanXs}>
              <LanguageSwitcher />
            </Box>
            {/* Does not fit in mobile portrait mode display */}
            <Box className={classes.hiddenIfSmallerThanXs}>
              <LightDarkButton />
            </Box>
            {!!session && status === "authenticated" && (
              <Box>
                <Notifications />
              </Box>
            )}
            <Box>
              <LoginPanel />
            </Box>
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
            label="Menu"
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />
          <Link href="/" className={classes.link}>
            {t("common:app-headermenu-welcome")}
          </Link>
          <Link href="/grows" className={classes.link}>
            {t("common:app-headermenu-explore")}
          </Link>
          {!!session && status === "authenticated" && (
            <Link href="/account/grows" className={classes.link}>
              {t("common:usermenu-mygrows")}
            </Link>
          )}
          <Link href="/info/tech-stack" className={classes.link}>
            Technologie
          </Link>
          {/* <Link
            href="/how-to-manual-anleitung-wie-geht-das"
            className={classes.link}
          >
            {t("common:app-headermenu-how-to")}
          </Link> */}
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
          <Box>
            <LightDarkButton />
            <LanguageSwitcher />
          </Box>
          <Box></Box>
        </ScrollArea>
      </Drawer>

      {/* Background image */}
      <Box className={classes.appBackground} />

      {/* Overlay */}
      <Overlay className={classes.overlay} opacity={1} />

      {/* Content */}
      <Box className="relative mt-16 pb-16">{children}</Box>

      <Footer />

      {/* handling TOS acceptance */}
      {status === "authenticated" && <AcceptedTOS />}

      {/* CookieConsent */}
      <Box pos="absolute">
        <CookieConsentBanner />
      </Box>

      {/* Supporter Welcome Modal */}
      <SupporterWelcomeModal
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      {/* Photo Credit */}
      {theme.colorScheme === "dark" && (
        <Box className={classes.photoCredit}>
          <u>
            <a
              target="_blank"
              href="https://unsplash.com/de/fotos/fv2IDVHFgl4?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
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
          </u>
        </Box>
      )}
      {theme.colorScheme !== "dark" && (
        <Box className={classes.photoCredit}>
          <u>
            <a
              target="_blank"
              href="https://unsplash.com/de/fotos/eine-topfpflanze-mit-grunen-blattern-auf-weissem-hintergrund-h9ue_EmlM7s?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
            >
              Background Image on Unsplash
            </a>
          </u>{" "}
          from{" "}
          <u>
            <a
              target="_blank"
              href="https://unsplash.com/de/@2hmedia?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
            >
              2H Media
            </a>
          </u>
        </Box>
      )}
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SupporterModalProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SupporterModalProvider>
  );
}
