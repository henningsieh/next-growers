import {
  ActionIcon,
  Alert,
  Box,
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
import { IconAt, IconMail, IconReload } from "@tabler/icons-react";
import { useForm, zodResolver } from "@mantine/form";

import AccessDenied from "~/components/Atom/AccessDenied";
import AppNotification from "~/components/Atom/Notification";
import type { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { IconAlertCircle } from "@tabler/icons-react";
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
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();

  /**
   * function: setRandomUsername()
   */
  const setRandomUsername = function (): string {
    form.setValues({ name: getUsername() });
    return form.values.name;
  };

  /**
   * Zod Validation Schema
   */
  const validateFormSchema = z.object({
    name: z
      .string()
      .min(6, { message: "Username must have at least 6 letters" }),
    /* .refine((value) => !/\s/.test(value), {
        message: "Userame must not contain whitespace characters",
      }), */
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
      onSuccess() {
        setOpened(true);
      },
      onSettled() {
        setTimeout(() => {
          setOpened(false);
        }, 2500);
      },
    });

  /**
   * rendering the form if authenticated
   */
  if (session?.user) {
    return (
      <>
        <Head>
          <title>{`GrowAGram | ${pageTitle}`}</title>

          <meta
            name="description"
            content="Edit your profile details on growagram.com"
          />
        </Head>

        <AppNotification
          title="Success"
          text="Your username has been saved to database."
          opened={opened}
        />

        <div className="m-auto flex min-h-max flex-col place-content-center">
          <div className="flex min-w-max flex-col space-y-4">
            <Title order={1}>{pageTitle}</Title>
            <Container px={0} size="sm">
              {!session?.user.name && (
                <Alert
                  mt="lg"
                  icon={<IconAlertCircle size="1rem" />}
                  title="You don't have a username yet!"
                  color="red"
                  variant="filled"
                >
                  <Box className="">
                    You need to set a Username first before exploroing all the
                    grows.
                  </Box>
                </Alert>
              )}

              <Box
                mb="sm"
                mt="xl"
                mr="sm"
                className="text-md flex justify-end font-bold"
              >
                No Idea? Try out some AI generated Usernames!{" "}
                <p className="-mr-2 ml-1 text-3xl">👇</p>
              </Box>
              <Space />
              <form
                onSubmit={form.onSubmit((values) =>
                  tRPCsetUsername({ id: session.user.id, name: values.name })
                )}
              >
                <TextInput
                  icon={<IconAt />}
                  withAsterisk
                  label="Username"
                  {...form.getInputProps("name")}
                  mt="-xs"
                  rightSection={
                    <Tooltip
                      arrowPosition="side"
                      position="top-end"
                      openDelay={100}
                      label="Let AI generate my Username"
                    >
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
                  icon={<IconMail />}
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
          </div>
        </div>
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
