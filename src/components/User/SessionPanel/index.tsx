import {
  ActionIcon,
  Button,
  createStyles,
  Group,
  Menu,
  rem,
  useMantineColorScheme, //useMantineTheme, // useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconLogout,
  IconPlant,
  IconSquarePlus,
  IconUserEdit,
} from "@tabler/icons-react";
import { IconLogin2 } from "@tabler/icons-react";

import { useEffect } from "react";

import { signOut, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { LoginModal } from "~/components/Atom/LoginModal";

const useStyles = createStyles((theme) => ({
  dropdown: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.fn.lighten(theme.colors.dark[6], 0.0)
        : theme.fn.lighten(theme.colors.growgreen[5], 0.7),
  },
  label: {
    fontSize: theme.fontSizes.sm,
    fontWeight: "bold",
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
  },
  item: {
    color: theme.white,
    padding: rem(8),
    marginBottom: rem(2),
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.colors.gray[6],
    "&[data-hovered]": {
      backgroundColor: theme.colors[theme.primaryColor][4],
      color: theme.white,
    },
  },
  divider: {
    borderTop: `2px ${
      theme.colorScheme === "dark"
        ? theme.colors.gray[8]
        : theme.colors.gray[5]
    }`,
    borderStyle: "solid",
  },
}));

export default function SessionPanel() {
  const router = useRouter();
  //const theme = useMantineTheme();

  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const { classes } = useStyles();
  const { data: session, status } = useSession();

  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    async function redirectToEditAccount() {
      const editProfilePath = "/profile/edit";
      if (
        status === "authenticated" &&
        !session?.user.name &&
        router.asPath != editProfilePath
      ) {
        await router.push(editProfilePath);
      }
    }
    void redirectToEditAccount();
    // router must not be a dependency, because we don't
    // want to trigger a rerender on every router change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status]);

  return (
    <>
      <LoginModal opened={opened} close={close} />

      <Group position="center">
        {status === "authenticated" ? (
          <Menu
            position="bottom-end"
            offset={+2}
            withArrow
            arrowPosition="side"
            classNames={classes}
            shadow="xl"
            width={225}
          >
            <Menu.Target>
              <ActionIcon
                className="cursor-default overflow-hidden"
                radius={3}
                variant="outline"
                color={dark ? "orange.6" : "growgreen.5 "}
                size={32}
                m={0}
                p={0}
              >
                <Image
                  className="rounded-sm"
                  height={32}
                  width={32}
                  src={
                    session.user.image
                      ? session.user.image
                      : `https://ui-avatars.com/api/?name=${
                          session.user.name as string
                        }`
                  }
                  alt={`${session.user.name as string}'s Profile Image`}
                />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown className="mr-4" mr={45}>
              <Menu.Label>Grows</Menu.Label>
              <Link href="/account/grows">
                <Menu.Item icon={<IconPlant size={20} />}>
                  {t("common:usermenu-mygrows")}
                </Menu.Item>
              </Link>

              {/* <Menu.Item
                icon={<IconPhoto size={20} />}
                // Shotcut Indicator
                rightSection={
                  <Text size="xs" color="dimmed">
                    ⌘K
                  </Text>
                }
              >
                My Images
              </Menu.Item> */}

              <Link href="/account/grows/create">
                <Menu.Item
                  bg="growgreen.5"
                  icon={<IconSquarePlus size={20} />}
                >
                  {t("common:usermenu-addnewgrow")}
                </Menu.Item>
              </Link>

              <Menu.Divider />
              <Menu.Label>Profile</Menu.Label>
              <Link href="/profile/edit">
                <Menu.Item icon={<IconUserEdit size={20} />}>
                  {t("common:usermenu-myprofile")}
                </Menu.Item>
              </Link>

              <Menu.Divider />
              <Menu.Label>Logout</Menu.Label>
              <Menu.Item
                onClick={() =>
                  void signOut({
                    callbackUrl: `/${activeLocale as string}/grows`,
                  })
                }
                // bg="red.9"
                sx={(theme) => ({
                  // subscribe to color scheme changes
                  "&:hover": {
                    backgroundColor: theme.colors.red[9],
                    color: theme.white,
                  },
                })}
                icon={<IconLogout size={20} />}
              >
                {t("common:usermenu-logout")}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : (
          <Button
            compact
            fz="xl"
            size="lg"
            c="white"
            fw="normal"
            radius="xs"
            variant="filled"
            h={rem(32)}
            color={dark ? "growgreen" : "growgreen"}
            leftIcon={<IconLogin2 stroke={2} size={"22"} />}
            onClick={open}
          >
            {t("common:app-headermenu-signin")}
          </Button>
        )}
      </Group>
    </>
  );
}
