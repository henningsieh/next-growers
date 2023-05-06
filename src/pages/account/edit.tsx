import {
  ActionIcon,
  Box,
  Button,
  Container,
  Group,
  NumberInput,
  Space,
  TextInput,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import {
  IconAt,
  IconBackspace,
  IconReload,
  IconUser,
} from "@tabler/icons-react";
import { useForm, zodResolver } from "@mantine/form";

import type { GetServerSidePropsContext } from "next";
import Head from "next/head";
import Link from "next/link";
import type { NextPage } from "next";
import { api } from "~/utils/api";
import { authOptions } from "~/server/auth";
import { getServerSession } from "next-auth/next";
import { getUsername } from "~/helpers";
import { useSession } from "next-auth/react";
import { userSetUSerNameInput } from "~/types";
import { z } from "zod";

export default function EditReport() {
  const pageTitle = "Edit Profile";
  const { data: session } = useSession();

  const theme = useMantineTheme();

  const setRandomUsername = () => {
    form.setValues({ name: getUsername() });
    form.values.name = getUsername();
  };
  const validateFormSchema = z.object({
    name: z.string().min(6, { message: "Name should have at least 6 letters" }),
    email: z.string().email({ message: "Invalid email address" }),
  });

  const form = useForm({
    validate: zodResolver(validateFormSchema),
    initialValues: {
      email: session?.user.email,
      name: !!session?.user.name ? session.user.name : "",
    },
  });

  const { mutate: tRPCsetUsername, isLoading } =
    api.user.saveOwnUsername.useMutation({
      onMutate: (editedUser) => {
        console.log(editedUser);
      },
    });

  if (session?.user) {
    return (
      <>
        <Head>
          <title>GrowAGram | {pageTitle}</title>
          <meta
            name="description"
            content="Upload and create your Report to growagram.com"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Group position="left">
          <Link href="/account">
            <Button variant="default" /* onClick={() => router.back()} */>
              <IconBackspace className="mr-2" height={24} stroke={1.5} /> Your
              Profile
            </Button>
          </Link>
        </Group>
        <Container size="xs">
          <Title order={1}>{pageTitle}</Title>
          <Space />
          <form
            onSubmit={form.onSubmit((values) =>
              tRPCsetUsername({ id: session.user.id, name: values.name })
            )}
          >
            <TextInput
              icon={<IconUser />}
              withAsterisk
              label="Username"
              {...form.getInputProps("name")}
              mt="lg"
              rightSection={
                <Tooltip label="Generate random Username">
                  <ActionIcon
                    onClick={setRandomUsername}
                    size={28}
                    radius="sm"
                    color={theme.primaryColor}
                    variant="outline"
                  >
                    <IconReload size="1.2rem" stroke={1.5} />
                  </ActionIcon>
                </Tooltip>
              }
            />
            <TextInput
              readOnly
              className="cursor-not-allowed"
              icon={<IconAt />}
              withAsterisk
              label="Email address"
              {...form.getInputProps("email")}
              mt="lg"
            />
            <Space />
            <Group position="right" mt="xl">
              <Button variant="outline" type="submit" disabled={isLoading}>
                Submit
              </Button>
            </Group>
          </form>
        </Container>
      </>
    );
  }

  return <p className="text-6xl">Access Denied</p>;
}

/**
 * PROTECTED PAGE
 */
export async function getServerSideProps(ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) {
  return {
    props: {
      session: await getServerSession(ctx.req, ctx.res, authOptions),
    },
  };
}
