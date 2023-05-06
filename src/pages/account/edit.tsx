import {
  ActionIcon,
  Button,
  Container,
  Group,
  Loader,
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

import AccessDenied from "~/components/Atom/AccessDenied";
import type { GetServerSidePropsContext } from "next";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { api } from "~/utils/api";
import { authOptions } from "~/server/auth";
import { getServerSession } from "next-auth/next";
import { getUsername } from "~/helpers";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { z } from "zod";

export default function EditReport() {
  const pageTitle = "Edit Profile";
  const { data: session } = useSession();

  const theme = useMantineTheme();

  /**
   * function: setRandomUsername(): string
   */
  const setRandomUsername = function (): string {
    form.setValues({ name: getUsername() });
    return form.values.name;
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
            />{" "}
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
              <Button
                fullWidth
                variant="outline"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? <Loader size={24} /> : "Submit"}
              </Button>
            </Group>
          </form>
        </Container>
      </>
    );
  }

  return <AccessDenied />;
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
