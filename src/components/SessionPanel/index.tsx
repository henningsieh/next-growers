import {
  ActionIcon,
  Button,
  Group,
  Menu,
  rem,
  useMantineColorScheme, // useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconLogout,
  IconPlant,
  IconSquarePlus,
  IconUser,
} from "@tabler/icons-react";
import { IconLogin2 } from "@tabler/icons-react";

import { useEffect } from "react";

import { signOut, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { LoginModal } from "~/components/Atom/LoginModal";

export default function SessionPanel() {
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);
  const { data: session, status } = useSession();

  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    async function redirectToEditAccount() {
      const editProfilePath = "/account/edit";
      if (
        status === "authenticated" &&
        !session?.user.name &&
        router.asPath != editProfilePath
      ) {
        await router.push(editProfilePath);
      }
    }
    void redirectToEditAccount();
  }, [session, router, status]);

  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  // const theme = useMantineTheme();

  return (
    <>
      <LoginModal opened={opened} close={close} />

      <Group position="center">
        {status === "authenticated" ? (
          <Menu shadow="xl" width={200}>
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

            <Menu.Dropdown>
              <Menu.Label>Grows</Menu.Label>
              <Link href="/account/grows">
                <Menu.Item icon={<IconPlant size={14} />}>
                  {t("common:usermenu-mygrows")}
                </Menu.Item>
              </Link>

              {/* <Menu.Item
                icon={<IconPhoto size={14} />}
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
                  color="green"
                  icon={<IconSquarePlus size={14} />}
                >
                  {t("common:usermenu-addnewgrow")}
                </Menu.Item>
              </Link>

              <Menu.Divider />
              <Menu.Label>Profile</Menu.Label>
              <Link href="/account/edit">
                <Menu.Item icon={<IconUser size={14} />}>
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
                color="groworange.5"
                icon={<IconLogout size={14} />}
              >
                {t("common:usermenu-logout")}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : (
          <Button
            compact
            fz="lg"
            fw="bold"
            h={rem(32)}
            size="lg"
            variant="filled"
            color="growgreen"
            onClick={open}
          >
            <Group position="right">
              <IconLogin2 size={"22"} />
              {t("common:app-headermenu-signin")}
            </Group>
          </Button>
        )}
      </Group>
    </>
  );
}
