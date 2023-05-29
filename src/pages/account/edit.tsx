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
import { useForm, zodResolver } from "@mantine/form";
import { IconAt, IconMail, IconReload } from "@tabler/icons-react";
import { IconAlertCircle } from "@tabler/icons-react";
import { getUsername } from "~/helpers";
import { InputEditProfile } from "~/helpers/inputValidation";

import { useState } from "react";

import type { GetServerSidePropsContext, NextPage } from "next";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Image from "next/image";

import AccessDenied from "~/components/Atom/AccessDenied";
import AppNotification from "~/components/Atom/Notification";

import { authOptions } from "~/server/auth";

import { api } from "~/utils/api";

/**
 * PROTECTED PAGE with session and translations
 * async getServerSideProps()
 *
 * @param context: GetServerSidePropsContext<{translations: string | string[] | undefined;}>
 * @returns : Promise<{props: { session: Session | null } | undefined;};}>
 */
export async function getServerSideProps(
  context: GetServerSidePropsContext<{
    translations: string | string[] | undefined;
  }>
) {
  // Fetch translations using next-i18next
  const translations = await serverSideTranslations(
    context.locale as string,
    ["common"]
  );
  return {
    props: {
      ...translations,
      session: await getServerSession(
        context.req,
        context.res,
        authOptions
      ),
    },
  };
}

const ProtectedEditReport: NextPage = () => {
  const pageTitle = "Edit Profile";
  const { data: session, update } = useSession();
  const [appNotificationOpened, setOpened] = useState(false);
  const theme = useMantineTheme();
  /**
   * function: setRandomUsername()
   */
  const setRandomUsername = function (): string {
    form.setValues({ name: getUsername() });
    return form.values.name;
  };

  const form = useForm({
    validate: zodResolver(InputEditProfile),
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
        void update();
        setTimeout(() => {
          setOpened(false);
        }, 2500);
      },
    });

  // rendering the form if authenticated
  if (!session?.user) return <AccessDenied />;

  return (
    <>
      <Head>
        <title>{`GrowAGram | ${pageTitle}`}</title>
        <meta
          name="description"
          content="Edit your profile details on growagram.com"
        />
      </Head>

      {/* // Main Content Container */}
      <Container size="xl" className="flex w-full flex-col space-y-1">
        {/* // Header with Title */}
        <div className="flex items-center justify-between pt-2">
          {/* // Title */}
          <Title order={1} className="inline">
            {pageTitle}
          </Title>
        </div>
        {/* // Header End */}

        <Container
          size="xs"
          px={0}
          className="flex w-full flex-col space-y-1"
          mx="auto"
        >
          <Group position="center" mt="xl">
            <Box pb="xl">
              <Image
                className="... rounded-full"
                height={142}
                width={142}
                src={session.user.image as string}
                alt={`${session.user.name as string}'s Profile Image`}
              />
            </Box>
          </Group>
          {/* // Error if no Username */}
          {!session?.user.name && (
            <Alert
              mt="lg"
              icon={<IconAlertCircle size="1rem" />}
              title="You don't have a username yet!"
              color="red"
              variant="outline"
            >
              <Box className="">
                You must first set a username before you can explore all
                grows.
              </Box>
            </Alert>
          )}

          {/* // "AI" Username Generater */}
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
              tRPCsetUsername({
                id: session.user.id,
                name: values.name,
              })
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
                    className="cursor-default"
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
                variant="outline"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? <Loader size={24} /> : "Save Profile"}
              </Button>
            </Group>
          </form>
        </Container>
      </Container>
      <AppNotification
        title="Success"
        text="Your username has been saved to database."
        opened={appNotificationOpened}
      />
    </>
  );
};

export default ProtectedEditReport;
