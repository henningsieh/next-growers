import { Button, Group, Menu, Modal } from "@mantine/core";
import {
  IconArrowsLeftRight,
  IconLogout,
  IconMessageCircle,
  IconPhoto,
  IconSearch,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";

import { Avatar } from "@mantine/core";
import Link from "next/link";
import LoginForm from "./LoginForm";
import { useDisclosure } from "@mantine/hooks";

export default function LoginModal() {
  const { data: session, status } = useSession();
  const [opened, { open, close }] = useDisclosure(false);
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
          <Menu shadow="md" width={200}>
            <Menu.Target>
              {/* <Button>Toggle menu</Button> */}
              <Avatar
                src={session.user.image}
                className="cursor-pointer"
                variant="outline"
                radius="xl"
                size="md"
                color="grape"
              />
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>High</Menu.Label>
              <Link href="/account/edit">
                <Menu.Item icon={<IconUser size={14} />}>
                  Edit Profile
                </Menu.Item>
              </Link>
              {/* <Menu.Item icon={<IconMessageCircle size={14} />}>
                Messages
              </Menu.Item> */}
              <Link href="/account/reports">
                <Menu.Item icon={<IconPhoto size={14} />}>My Reports</Menu.Item>
              </Link>
              <Menu.Item
                icon={<IconSearch size={14} />}
                // Shotcut Indicator
                // rightSection={<Text size="xs" color="dimmed">⌘K</Text>}
              >
                Search
              </Menu.Item>

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
              size={"xs"}
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
