import LoginForm from "./LoginForm";
import {
  ActionIcon,
  Button,
  Group,
  Menu,
  Modal,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconLogout,
  IconPlant,
  IconSquarePlus,
  IconUser,
} from "@tabler/icons-react";

import { useEffect } from "react";

import { signOut, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export default function LoginModal() {
  const [opened, { open, close }] = useDisclosure(false);

  const { data: session, status } = useSession();
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

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

  /*   const form = useForm({
    initialValues: {
      email: '',
      termsOfService: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      termsOfService: (value) => (value!==false ? null : 'You have to accept our terms of service!')
    },
  }); */
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Sign in to GrowAGram.com 🔒"
        centered
      >
        {/* Modal content */}

        <LoginForm />
      </Modal>

      <Group position="center">
        {status === "authenticated" ? (
          <Menu shadow="xl" width={200}>
            <Menu.Target>
              <ActionIcon
                className="cursor-default"
                radius={3}
                variant="outline"
                color={dark ? theme.primaryColor : "grape"}
                size={32}
                m={0}
                p={0}
              >
                <Image
                  className="rounded-sm"
                  height={32}
                  width={32}
                  src={session.user.image as string}
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
                color="red"
                icon={<IconLogout size={14} />}
              >
                {t("common:usermenu-logout")}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : (
          <>
            <Button
              className="cursor-default"
              variant="default"
              size={"sm"}
              onClick={open}
            >
              Sign in 🔒
            </Button>
          </>
        )}
      </Group>
    </>
  );
}
