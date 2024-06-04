import {
  ActionIcon,
  Box,
  Button,
  Container,
  createStyles,
  Group,
  LoadingOverlay,
  Progress,
  rem,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import type { FileWithPath } from "@mantine/dropzone";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconCloudUpload,
  IconDownload,
  IconFileArrowRight,
  IconTrashXFilled,
  IconX,
} from "@tabler/icons-react";
import { httpStatusErrorMsg } from "~/messages";

import { useEffect, useRef, useState } from "react";

//import { useTranslation } from "react-i18next";
import type { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { ImagePreview } from "~/components/Atom/ImagePreview";

import type { CloudinaryResonse } from "~/types";

import { api } from "~/utils/api";
import { handleMultipleDrop } from "~/utils/helperUtils";
import { InputCreateReportForm } from "~/utils/inputValidation";

interface AddFormProps {
  user: User;
  textContinueButton: string;
}

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    alignItems: "center", // add this line
    height: "100%", // add this line
  },

  dropzone: {
    borderWidth: rem(1),
    padding: rem(5),
    height: "100%", // add this line
    display: "flex", // add this line
    alignItems: "center", // add this line
    justifyContent: "center", // add this line
  },

  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },

  control: {
    position: "absolute",
    width: rem(250),
    left: `calc(50% - ${rem(125)})`,
    bottom: rem(-20),
  },
  bar: {
    justifyContent: "flex-start", // Align label to the left
  },
  label: {
    paddingLeft: theme.spacing.xs,
    fontSize: 12,
    fontFamily: theme.fontFamilyMonospace,
  },
}));

export function CreateReportForm({
  user,
  textContinueButton,
}: AddFormProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { locale: activeLocale } = router;
  //const { t } = useTranslation(activeLocale);

  const { classes, theme } = useStyles();
  const openReference = useRef<() => void>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [imageId, setImageId] = useState("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [cloudUrl, setCloudUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState<
    {
      value: number;
      label: string;
    }[]
  >([]);

  const { mutate: tRPCcreateReport } = api.reports.create.useMutation({
    onMutate: () => {
      console.debug("START api.reports.create.useMutation");
    },
    // If the mutation fails, use the context
    // returned from onMutate to roll back
    onError: (error) => {
      notifications.show(
        httpStatusErrorMsg(error.message, error.data?.httpStatus)
      );
      console.error({ error });
    },
    onSuccess: (newReportDB) => {
      // Navigate to the edit report page
      void router.push(
        {
          pathname: `/account/grows/edit/${newReportDB.id}/editGrow`,
          query: { newReport: "true" }, // Separate query parameters
        },
        undefined,
        { scroll: true, locale: activeLocale }
      );
    },
    // Always refetch after error or success:
    onSettled: () => {
      console.log("END api.reports.create.useMutation");
    },
  });

  const createReportForm = useForm({
    validate: zodResolver(InputCreateReportForm),
    validateInputOnChange: true,
    initialValues: {
      title: "",
      description: "",
      imageId: "",
    },
  });

  const handleErrors = (errors: typeof createReportForm.errors) => {
    Object.keys(errors).forEach((key) => {
      notifications.show(
        httpStatusErrorMsg(errors[key] as string, 422)
      );
    });
  };

  const [imagesUploadedToCloudinary, setImagesUploadedToCloudinary] =
    useState<CloudinaryResonse[]>([]);

  const { mutate: tRPCcreateImage } = api.image.createImage.useMutation(
    {
      onError: (error) => {
        notifications.show(
          httpStatusErrorMsg(error.message, error.shape?.code)
        );
        console.error(error);
      },
      onSuccess: (newImage) => {
        setImagesUploadedToCloudinary([]);

        if (!!newImage) {
          setCloudUrl(newImage.cloudUrl);
          createReportForm.setFieldValue("imageId", newImage.id);
        }
      },
      onSettled: (_newImage) => {
        // indicate that saving process is ready:
        setIsSaving(false);
      },
    }
  );

  useEffect(() => {
    if (status === "authenticated" && !isUploading) {
      // Save new images to db
      void imagesUploadedToCloudinary.map((image) => {
        tRPCcreateImage({
          cloudUrl: image.secure_url,
          publicId: image.public_id,
          ownerId: session.user.id,
        });
      });
    }
  }, [
    imagesUploadedToCloudinary,
    isUploading,
    session?.user.id,
    status,
    tRPCcreateImage,
  ]);

  const handleMultipleDropWrapper = async (
    fileWithPath: FileWithPath[]
  ) => {
    setIsUploading(true);
    setIsSaving(true); //controlls upload inactive overlay

    const _result = await handleMultipleDrop(
      fileWithPath,
      setImagesUploadedToCloudinary,
      setUploadProgress
    ).catch((error) => {
      console.error(error);
    });

    setIsUploading(false); //triggers tRPCcreateImage in ImageUploader
    setUploadProgress([]);
  };

  return (
    <>
      <Container
        size="md"
        px={0}
        className="flex w-full flex-col space-y-1"
        mx="auto"
      >
        {/* // Upload Panel */}

        {cloudUrl ? (
          <>
            {/* // Image Preview */}
            <Box className="relative" px={0}>
              <Box className="absolute right-2 top-2 z-50 flex justify-end">
                <ActionIcon
                  title="delete this image"
                  onClick={() => {
                    setImageId("");
                    setCloudUrl("");
                  }}
                  color="red"
                  variant="filled"
                >
                  <IconTrashXFilled size="lg" />
                </ActionIcon>
              </Box>
              <ImagePreview
                imageUrl={cloudUrl}
                title={createReportForm.values.title}
                description={createReportForm.values.description}
                publicLink="#"
                authorName={user.name as string}
                authorImageUrl={
                  user.image
                    ? user.image
                    : `https://ui-avatars.com/api/?name=${
                        user.name as string
                      }`
                }
                comments={89}
                views={183}
              />
            </Box>
          </>
        ) : (
          <>
            {/* Dropzone */}
            <Box className={classes.wrapper}>
              <LoadingOverlay
                visible={isSaving}
                transitionDuration={600}
                overlayBlur={2}
              />
              <Dropzone
                accept={IMAGE_MIME_TYPE}
                className={classes.dropzone}
                h={rem(280)}
                multiple={false} // only one image for now!
                openRef={openReference}
                onDrop={(files) => {
                  void handleMultipleDropWrapper(files);
                }}
                onReject={(files) => {
                  files.forEach((file) => {
                    notifications.show(
                      httpStatusErrorMsg(file.file.name, 500)
                    );
                  });
                }}
              >
                <Box style={{ pointerEvents: "none" }}>
                  <Group position="center">
                    {/* <Center> */}
                    <Dropzone.Accept>
                      <IconDownload
                        size={rem(50)}
                        color={
                          theme.colorScheme === "dark"
                            ? theme.colors.blue[0]
                            : theme.white
                        }
                        stroke={1.6}
                      />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                      <IconX
                        size={rem(50)}
                        color={theme.colors.red[6]}
                        stroke={1.6}
                      />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                      <IconCloudUpload
                        size={rem(50)}
                        color={
                          theme.colorScheme === "dark"
                            ? theme.colors.growgreen[4]
                            : theme.colors.groworange[4]
                        }
                        stroke={1.6}
                      />
                    </Dropzone.Idle>
                  </Group>

                  <Text ta="center" fw={700} fz="lg" mt="xl">
                    <Dropzone.Accept>Drop files here</Dropzone.Accept>
                    <Dropzone.Reject>
                      Only one Image with a size of less than 4.28 MB
                      (4.394 KB, 4.500.000 B)!
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                      Drag&apos;n&apos;drop your{" "}
                      <span style={{ color: "green" }}>
                        Grow Header Image
                      </span>{" "}
                      here to upload!
                    </Dropzone.Idle>
                  </Text>
                  <Text ta="center" fz="sm" my="xs" c="dimmed">
                    <b>
                      The app accepts one (1) <i>.jpg/.png/.gif</i>{" "}
                      image file, that is less than 4.5 MB in size.
                    </b>
                  </Text>
                </Box>
              </Dropzone>
            </Box>
            {/* Upload progress indicator */}
            {uploadProgress.map((item, index) => (
              <Progress
                key={index}
                value={item.value}
                label={item.label}
                color={theme.colors.growgreen[4]}
                size={rem(20)}
                animate={isUploading}
                my="xs"
                classNames={classes}
              />
            ))}
          </>
        )}

        <form
          onSubmit={createReportForm.onSubmit((values) => {
            // send imageId as formField so that the report can be related
            createReportForm.setValues({ imageId: imageId });
            tRPCcreateReport(values);
          }, handleErrors)}
        >
          <Box className="space-y-4">
            <TextInput
              hidden
              type="text"
              {...createReportForm.getInputProps("imageId")}
              value={imageId}
            />
            <Textarea
              label="Bockquote cite:"
              description="This appears at the top of your Grow's main header image"
              placeholder="A journey through the wonderful world of cannabis cultivation!"
              withAsterisk
              mt="sm"
              autosize
              minRows={3}
              {...createReportForm.getInputProps("description")}
            />
            <TextInput
              label="Title:"
              description="This appears as headline on your Grow's main details page"
              withAsterisk
              mt="sm"
              {...createReportForm.getInputProps("title")}
            />
            <Group position="right" mt="xl">
              <Button
                fz="lg"
                variant="filled"
                color="growgreen"
                className="cursor-pointer"
                disabled={!createReportForm.isValid()}
                leftIcon={
                  <IconFileArrowRight stroke={2.2} size="1.4rem" />
                }
                type="submit"
              >
                {textContinueButton}
              </Button>
            </Group>
          </Box>
        </form>
      </Container>
    </>
  );
}
