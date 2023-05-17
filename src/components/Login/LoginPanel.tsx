import { ActionIcon, Button, Group, Menu, Modal } from "@mantine/core";
import {
  IconLogout,
  IconPhoto,
  IconSearch,
  IconSquarePlus,
  IconUser,
} from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";

import { Avatar } from "@mantine/core";
import Link from "next/link";
import LoginForm from "./LoginForm";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function LoginModal() {
  const [opened, { open, close }] = useDisclosure(false);

  const { data: session, status } = useSession();
  const router = useRouter();

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
  }, [session, router]);

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
              <Avatar
                src={session.user.image}
                className="cursor-pointer"
                variant="outline"
                radius="sm"
                size={32}
                p={0}
                color="grape"
              />
              {/* </ActionIcon> */}
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>High</Menu.Label>
              <Link href="/account/edit">
                <Menu.Item icon={<IconUser size={14} />}>
                  Edit my Profile
                </Menu.Item>
              </Link>
              {/* <Menu.Item icon={<IconMessageCircle size={14} />}>
                Messages
              </Menu.Item> */}
              <Link href="/account/reports">
                <Menu.Item icon={<IconPhoto size={14} />}>
                  Explore my Grows
                </Menu.Item>
              </Link>
              <Link href="/account/reports/create">
                <Menu.Item icon={<IconSquarePlus size={14} />}>
                  Create new Grow
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
                Sign out 👋
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
