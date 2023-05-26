import {
  ActionIcon,
  Button,
  Group,
  Menu,
  Modal,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import {
  IconLogout,
  IconPhoto,
  IconSquarePlus,
  IconUser,
} from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";

import Image from "next/image";
import Link from "next/link";
import LoginForm from "./LoginForm";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

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

      {/* // Open Modal from Navbar */}
      <Group position="center">
        {status === "authenticated" ? (
          <Menu shadow="xl" width={200}>
            <Menu.Target>
              {/* <Button>Toggle menu</Button> */}
              {/* <ActionIcon> */}
              <ActionIcon
                radius={3}
                variant="outline"
                color={dark ? theme.primaryColor : "grape"}
                size={32}
                m={0}
                p={0}
              >
                <Image
                  className="... cursor-default rounded-sm"
                  height={32}
                  width={32}
                  src={session.user.image as string}
                  alt={`${
                    session.user.name as string
                  }'s Profile Image`}
                />
              </ActionIcon>
              {/* </ActionIcon> */}
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>High</Menu.Label>
              <Link href="/account/edit">
                <Menu.Item icon={<IconUser size={14} />}>
                  {t("common:usermenu-myprofile")}
                </Menu.Item>
              </Link>
              {/* <Menu.Item icon={<IconMessageCircle size={14} />}>
                Messages
              </Menu.Item> */}
              <Link href="/account/reports">
                <Menu.Item icon={<IconPhoto size={14} />}>
                  {t("common:usermenu-mygrows")}
                </Menu.Item>
              </Link>
              <Link href="/account/reports/create">
                <Menu.Item
                  bg="green"
                  icon={<IconSquarePlus size={14} />}
                >
                  {t("common:usermenu-addnewgrow")}
                </Menu.Item>
              </Link>
              {/* 
              <Menu.Item
                icon={<IconSearch size={14} />}
                // Shotcut Indicator
                // rightSection={<Text size="xs" color="dimmed">⌘K</Text>}
              >
                Search
              </Menu.Item> */}

              <Menu.Divider />

              <Menu.Label>Stoned</Menu.Label>
              {/* <Menu.Item icon={<IconArrowsLeftRight size={14} />}>
                Transfer my data
              </Menu.Item> */}
              <Menu.Item
                onClick={() => void signOut()}
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
