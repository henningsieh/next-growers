/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { type ReactNode } from "react";
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
  ScrollArea,
  SimpleGrid,
  Text,
  ThemeIcon,
  UnstyledButton,
  createStyles,
  rem,
} from "@mantine/core";
import {
  IconChevronDown,
  IconMapPin,
  IconMessageCircle,
  IconSocial,
  IconStar,
  IconTools,
  IconUsers,
} from "@tabler/icons-react";

import { useDisclosure } from "@mantine/hooks";
import LoginPanel from "../components/Login/LoginPanel";
import Image from "next/image";
import Link from "next/link";
import LightDarkButton from "../components/Atom/LightDarkButton";

const useStyles = createStyles((theme) => ({
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
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },

  hiddenMobile: {
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan("md")]: {
      display: "none",
    },
  },
}));

const mockdata = [
  {
    icon: IconMessageCircle,
    title: "CannabisAnbauen.net",
    description: "Willkommen im CannabisAnbauen.net Forum!",
    url: "https://forum.cannabisanbauen.net/",
  },
  {
    icon: IconMapPin,
    title: "Meetups and Events",
    description: "Connect in person with fellow growers near you.",
  },
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
    description: "Join support groups for growers facing common challenges.",
  },
  {
    icon: IconStar,
    title: "Interest Groups",
    description:
      "Join groups dedicated to growing specific plants or using specific techniques.",
  },
];

function openUrlInNewTab(url: string) {
  window.open(url, "_blank");
}

export default function HeaderMegaMenu({ children }: { children: ReactNode }) {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const { classes, theme } = useStyles();

  const links = mockdata.map((item) => (
    <UnstyledButton
      onClick={() => openUrlInNewTab(item.url as string)}
      className={classes.subLink}
      key={item.title}
    >
      <Group noWrap align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon size={rem(22)} color={theme.fn.primaryColor()} />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" color="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  const handleUnstyledButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    toggleLinks();
  };

  return (
    <>
      <Header
        height={60}
        style={{
          position: "fixed",
          zIndex: 10,
          maxWidth: "1600px",
          width: "100%",
          margin: "0px auto",
          padding: "0 1.2rem",
        }}
      >
        <Group position="apart" sx={{ height: "100%" }}>
          <Group>
            <Burger
              size={30}
              pl={0}
              pr={0}
              opened={drawerOpened}
              onClick={toggleDrawer}
              className={classes.hiddenDesktop}
            />
            <Link href="/reports">
              <Image
                className="rounded-sm"
                height={18}
                width={74}
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
              Home
            </Link>
            <Link href="/reports" className={classes.link}>
              Explore Reports
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
                      Community
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
                  color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
                />

                <SimpleGrid cols={2} spacing={0}>
                  {links}
                </SimpleGrid>

                <div className={classes.dropdownFooter}>
                  <Group position="apart">
                    <div>
                      <Text fw={500} fz="sm">
                        Get started
                      </Text>
                      <Text size="xs" color="dimmed">
                        Their food sources have decreased, and their numbers
                      </Text>
                    </div>
                    <Button variant="default">Get started</Button>
                  </Group>
                </div>
              </HoverCard.Dropdown>
            </HoverCard>
            <Link href="/t3-app-info" className={classes.link}>
              T3 Stack
            </Link>
          </Group>
          <Group
          // className={classes.hiddenMobile}
          >
            <LightDarkButton />
            <LoginPanel />
          </Group>
          {/* <Burger opened={drawerOpened} onClick={toggleDrawer} className={classes.hiddenDesktop} /> */}
        </Group>
      </Header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        // padding="md"
        title="Navigation"
        className={classes.hiddenDesktop}
        zIndex={10}
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
            Home
          </Link>
          <Link href="/reports" className={classes.link}>
            Explore Reports
          </Link>
          <UnstyledButton
            className={classes.link}
            onClick={handleUnstyledButtonClick}
          >
            <Center inline>
              <Box component="span" mr={5}>
                Community
              </Box>
              <IconChevronDown size={16} color={theme.fn.primaryColor()} />
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{links}</Collapse>
          <Link href="/t3-app-info" className={classes.link}>
            T3 Stack
          </Link>

          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />
        </ScrollArea>
      </Drawer>

      <div className="mt-16 ">{children}</div>
    </>
  );
}
