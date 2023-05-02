import { Box, Button, Checkbox, Group, Menu, Modal, Text, TextInput } from '@mantine/core';
import { IconArrowsLeftRight, IconLogout, IconMessageCircle, IconPhoto, IconSearch, IconSettings, IconTrash } from '@tabler/icons-react';
import { signOut, useSession } from 'next-auth/react';

import { Avatar } from '@mantine/core';
import Link from 'next/link';
import LoginForm from './LoginForm';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';

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
      <Modal opened={opened} onClose={close} title="🪄 Magic Link and No Password! ❌"  centered>

        {/* Modal content */}

{/*         <Box maw={300} mx="auto">
          <form onSubmit={form.onSubmit((values) => console.log(values))}>
            <TextInput
              withAsterisk
              label="Email"
              placeholder="your@email.com"
              {...form.getInputProps('email')}
            />

            <Checkbox
              mt="md"
              label="I agree to sell my privacy"
              {...form.getInputProps('termsOfService', { type: 'checkbox' })}
            />

            <Group position="right" mt="md">
              <Button type="submit">Submit</Button>style={{ backgroundImage: `url("/MqISkm2iLGc-unsplash.jpg")` }}
            </Group>
          </form>
        </Box> */}

        <LoginForm />

        <Link href={"http://localhost:3000/api/auth/signin"} >Sign in with Google</Link>

      </Modal>

      {/* // Open Modal from Navbar */}
      <Group position="center">
{/*       {session?.user?.image 
                    ? (
                      <Image
                        alt={`${session.user.name || ''}'s Profile Image`}
                        width={500} height={500}
                        src={session.user.image}
                      /> ) 
                    : ( '' )} */}
      {status === "authenticated" 
        ? 
        <Menu shadow="md" width={200}>
          <Menu.Target>
            {/* <Button>Toggle menu</Button> */}
            <Avatar className="cursor-pointer" variant="outline" radius="xl" size="md" color="grape" 
                    src={session.user.image} 
            />
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Application</Menu.Label>
            <Menu.Item icon={<IconSettings size={14} />}>Settings</Menu.Item>
            <Menu.Item icon={<IconMessageCircle size={14} />}>Messages</Menu.Item>
            <Menu.Item icon={<IconPhoto size={14} />}><Link href="/account/reports">My Reports</Link></Menu.Item>
            <Menu.Item icon={<IconSearch size={14} />}
              // Shotcut Indicator
              // rightSection={<Text size="xs" color="dimmed">⌘K</Text>}
            >
              Search
            </Menu.Item>

            <Menu.Divider />

            <Menu.Label>Danger zone</Menu.Label>
            <Menu.Item icon={<IconArrowsLeftRight size={14} />}>Transfer my data</Menu.Item>
            <Menu.Item  onClick={() => void signOut()} color="red" icon={<IconLogout size={14} />}>Sign out</Menu.Item>
          </Menu.Dropdown>
        </Menu>
        :
        <Button variant="default" onClick={open}>Sign in 🔒</Button>
      }
      </Group>
    </>
  );
}