import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Container,
  createStyles,
  Group,
  LoadingOverlay,
  Progress,
  Space,
  TextInput,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconAlertCircle,
  IconAt,
  IconDeviceFloppy,
  IconMail,
  IconReload,
} from "@tabler/icons-react";
import type { ParsedUrlQuery } from "querystring";
import {
  httpStatusErrorMsg,
  setUserimageSuccessfulMsg,
  setUserNameSuccessfulMsg,
} from "~/messages";

import { useState } from "react";

import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
  PreviewData,
} from "next";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";
import { type SSRConfig, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

import AccessDenied from "~/components/Atom/AccessDenied";

import { authOptions } from "~/server/auth";

import type { CloudinaryResonse } from "~/types";

import { api } from "~/utils/api";
import {
  handleDrop as _handleDrop,
  getFakeAIUsername,
  handleMultipleDrop,
} from "~/utils/helperUtils";
import { InputEditProfile } from "~/utils/inputValidation";

/** PROTECTED DYNAMIC PAGE with translations
 * getServerSideProps (Server-Side Rendering)
 *
 * @param GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
 * @returns Promise<GetServerSidePropsResult<Props>>
 */
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) => {
  // Fetch server side translations
  const translations: SSRConfig = await serverSideTranslations(
    context.locale as string,
    ["common"]
  );
  // Fetch server side user session
  const session = await getServerSession(
    context.req,
    context.res,
    authOptions
  );
  //Pass translations and session to the page via props
  return { props: { ...translations, session } };
};

const useStyles = createStyles((theme) => ({
  bar: {
    justifyContent: "flex-start", // Align progess label to the left
  },
  label: {
    paddingLeft: theme.spacing.xs,
    fontSize: 12,
    fontFamily: theme.fontFamilyMonospace,
  },
}));

const ProtectedEditReport: NextPage = () => {
  const { data: session, update } = useSession();
  const { classes } = useStyles();
  const [uploadProgress, setUploadProgress] = useState<
    {
      value: number;
      label: string;
    }[]
  >([]);

  const router = useRouter();

  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const theme = useMantineTheme();
  const pageTitle = "Edit Profile";

  const { mutate: tRPCsetUsername, isLoading: isLoadingSetUsername } =
    api.user.saveOwnUsername.useMutation({
      onError: (error) => {
        // If unique constraint failed on the fields: (`name`)
        if (error.data?.httpStatus === 409) {
          notifications.show(
            httpStatusErrorMsg(
              "This username is already taken, please choose another one.",
              error.data?.httpStatus
            )
          );
        } else {
          notifications.show(
            httpStatusErrorMsg(error.message, error.data?.httpStatus)
          );
        }
      },
      onSuccess: (result) => {
        notifications.show(
          setUserNameSuccessfulMsg(result?.user.name as string)
        );
      },
      onSettled: () => {
        void update();
      },
    });

  const { mutate: tRPCsetUserImage, isLoading: isLoadingSetUserImage } =
    api.user.saveOwnUserImage.useMutation({
      onSuccess() {
        notifications.show(setUserimageSuccessfulMsg);
      },
      onSettled() {
        setUploadProgress([]);
        void update();
      },
    });

  const [isUploading, setIsUploading] = useState(isLoadingSetUserImage);

  const setRandomUsername = function (): string {
    editProfileForm.setValues({ name: getFakeAIUsername() });
    return editProfileForm.values.name;
  };

  const [_imagesUploadedToCloudinary, setImagesUploadedToCloudinary] =
    useState<CloudinaryResonse[]>([]);

  const handleDropWrapper = async (files: File[]): Promise<void> => {
    setIsUploading(true);

    try {
      const result = await handleMultipleDrop(
        files,
        setImagesUploadedToCloudinary,
        setUploadProgress
      ).catch((error) => {
        console.error(error);
      });

      tRPCsetUserImage({
        id: session?.user.id as string,
        imageURL: result?.cloudUrls[0] as string,
      });
    } catch (error) {
      console.error("Error handling file drop:", error);
    }

    setIsUploading(false);
  };

  const editProfileForm = useForm({
    validate: zodResolver(InputEditProfile),
    initialValues: {
      name: !!session?.user.name ? session.user.name : "",
      email: session?.user.email,
    },
  });

  // rendering the form only if authenticated
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
      <Container size="xl" className="flex w-full flex-col h-screen">
        {/* // Header with Title */}
        <Box className="flex items-center justify-between pt-2">
          {/* // Title */}
          <Title order={1} className="inline">
            {pageTitle}
          </Title>
        </Box>
        {/* // Header End */}

        <Container
          size="xs"
          px={0}
          className="flex w-full flex-col h-full"
          mx="auto"
        >
          <Group className="relative" position="center" mt="xl">
            <LoadingOverlay
              visible={isUploading}
              loaderProps={{
                size: "lg",
                color: theme.colors.groworange[4],
                variant: "oval",
              }}
              radius="sm"
              transitionDuration={600}
              overlayBlur={4}
            />

            <Tooltip
              position="bottom"
              label="Upload your new user profile image"
              openDelay={100}
              arrowPosition="center"
              color={theme.colors.growgreen[4]}
              transitionProps={{
                transition: "slide-down",
                duration: 400,
              }}
            >
              <Box>
                <Dropzone
                  accept={IMAGE_MIME_TYPE}
                  pb="xl"
                  className="p-4 border-0 rounded-full"
                  multiple={false}
                  maxFiles={1}
                  onDrop={(files) => {
                    void handleDropWrapper(files);
                  }}
                  onReject={(files) => {
                    files.forEach((file) => {
                      notifications.show(
                        httpStatusErrorMsg(file.file.name, 500)
                      );
                    });
                  }}
                  sx={(theme) => ({
                    backgroundColor:
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[6]
                        : theme.colors.gray[2],

                    "&[data-accept]": {
                      backgroundColor: theme.colors.growgreen[5],
                    },

                    "&[data-reject]": {
                      backgroundColor: theme.colors.red[9],
                    },
                  })}
                >
                  <Image
                    className="... rounded-full"
                    height={142}
                    width={142}
                    priority
                    src={
                      session.user.image
                        ? session.user.image
                        : `https://ui-avatars.com/api/?name=${
                            session.user.name as string
                          }`
                    }
                    alt={`${session.user.name as string}'s Profile Image`}
                  />
                </Dropzone>
              </Box>
            </Tooltip>
          </Group>
          {/* Upload progress indicator */}
          {uploadProgress.map((item, index) => (
            <Progress
              key={index}
              value={item.value}
              label={item.label}
              color={theme.colors.growgreen[4]}
              size={20}
              animate={isUploading}
              my="xs"
              classNames={classes}
            />
          ))}
          {/* // Error if no Username */}
          {!session?.user.name && (
            <Alert
              pt="lg"
              pb="lg"
              icon={<IconAlertCircle size={20} />}
              title="You don't have a username yet!"
              color="red"
              variant="outline"
            >
              You must first set a username before you can explore all
              grows.
            </Alert>
          )}

          <Space h="xl" />
          <Space h="xl" />

          {/* // "AI" Username Generater */}
          <Box
            mb="sm"
            mr="sm"
            className="text-md flex justify-end font-bold"
          >
            No Idea? Try out some AI generated Usernames!{" "}
            <p className="-mr-2 ml-1 text-3xl">👇</p>
          </Box>
          <form
            onSubmit={editProfileForm.onSubmit((values) =>
              tRPCsetUsername({
                id: session.user.id,
                name: values.name,
              })
            )}
          >
            <Box className="space-y-4">
              <TextInput
                icon={<IconAt />}
                withAsterisk
                label="Username"
                {...editProfileForm.getInputProps("name")}
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
                      <IconReload size={20} stroke={1.8} />
                    </ActionIcon>
                  </Tooltip>
                }
              />
              <TextInput
                disabled
                readOnly
                className="cursor-not-allowed"
                icon={<IconMail />}
                withAsterisk
                label="Email address"
                {...editProfileForm.getInputProps("email")}
              />
              <Space h={"md"} />
              <Group position="right">
                <Button
                  miw={200}
                  loading={isLoadingSetUsername}
                  type="submit"
                  title="save profile"
                  variant="filled"
                  className="cursor-default"
                  disabled={isLoadingSetUsername}
                  leftIcon={<IconDeviceFloppy size={22} />}
                >
                  {t("common:profile-save-button")}
                </Button>
              </Group>
            </Box>
          </form>
        </Container>
      </Container>
    </>
  );
};

export default ProtectedEditReport;
