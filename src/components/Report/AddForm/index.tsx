import {
  ActionIcon,
  Box,
  Button,
  Container,
  Group,
  Input,
  LoadingOverlay,
  Text,
  TextInput,
  Textarea,
  createStyles,
  rem,
} from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconCloudUpload,
  IconDownload,
  IconFileAlert,
  IconTrashXFilled,
  IconX,
} from "@tabler/icons-react";
import { handleDrop } from "~/helpers";
import { InputCreateReport } from "~/helpers/inputValidation";

import { useEffect, useRef } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

import type { User } from "next-auth";
import { useRouter } from "next/router";

import AccessDenied from "~/components/Atom/AccessDenied";
import { ImagePreview } from "~/components/Atom/ImagePreview";

import { api } from "~/utils/api";

interface AddFormProps {
  user: User;
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
}));

function Form({ user }: AddFormProps) {
  const router = useRouter();
  const { classes, theme } = useStyles();
  const openReference = useRef<() => void>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isUploading, setIsUploading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [reportId, setReportId] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [reportTitle, setReportTitle] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [reportDescription, setReportDescription] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imageId, setImageId] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imagePublicId, setImagePublicId] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cloudUrl, setCloudUrl] = useState("");

  // Update "imageId" state, if "imageId" form field value changes
  useEffect(() => {
    form.setFieldValue("imageId", imageId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageId]);

  const handleDropWrapper = (files: File[]): void => {
    setIsUploading(true);

    // handleDrop calls the /api/upload endpoint
    handleDrop(
      files,
      setImageId,
      setImagePublicId,
      setCloudUrl,
      setIsUploading
    ).catch((error) => {
      console.debug(error);
    });
  };

  const { mutate: tRPCcreateReport } = api.reports.create.useMutation({
    onMutate: (newReportDB) => {
      console.log("START api.reports.create.useMutation");
      console.log("newReportDB", newReportDB);
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newReport, context) => {
      toast.error("An error occured when saving your report");
      if (!context) return;
      console.log(context);
    },
    onSuccess: (newReportDB) => {
      // Navigate to the new report page
      void router.push(`/account/grows/${newReportDB.id}`);
    },
    // Always refetch after error or success:
    onSettled: () => {
      console.log("END api.reports.create.useMutation");
    },
  });

  const handleErrors = (errors: typeof form.errors) => {
    console.log(errors);
    if (errors.description) {
      toast.error(errors.description as string);
    }
    if (errors.title) {
      toast.error(errors.title as string);
    }
    if (errors.imageId) {
      toast.error(errors.imageId as string);
    }
  };

  const form = useForm({
    validate: zodResolver(InputCreateReport),
    validateInputOnChange: true,
    initialValues: {
      title: "",
      description: "",
      imageId: "",
    },
  });

  if (!user) return <AccessDenied />;

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
                title={form.values.title}
                description={form.values.description}
                publicLink="#"
                authorName={user.name as string}
                authorImageUrl={user.image as string}
                comments={89}
                views={183}
              />
            </Box>
          </>
        ) : (
          /* // Dropzone */
          <Box className={classes.wrapper}>
            <LoadingOverlay
              visible={isUploading}
              transitionDuration={600}
              overlayBlur={2}
            />
            <Dropzone
              className={classes.dropzone}
              h={rem(280)}
              multiple={false} // only one image for now!
              openRef={openReference}
              onDrop={handleDropWrapper}
              maxSize={4500000} // Vercel production environment post size limit which is 4.500.000 byte
              accept={[MIME_TYPES.jpeg, MIME_TYPES.png, MIME_TYPES.gif]}
              onReject={(files) => {
                if (files[0]) {
                  const fileSizeInBytes = files[0].file.size;
                  const fileSizeInMB = (
                    fileSizeInBytes /
                    1024 ** 2
                  ).toFixed(2);
                  notifications.show({
                    title: "Error",
                    message:
                      "File size of " +
                      fileSizeInMB +
                      " MB exceeds the allowed maximum of ≈ 4.28 MB (4.394 KB, 4.500.000 B)!",
                    color: "red",
                    icon: <IconFileAlert />,
                    loading: false,
                  });
                }
              }}
              // onChange={(e) => {
              //   console.debug(e.currentTarget);
              // }}
              // radius="md"
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
                      stroke={1.5}
                    />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconX
                      size={rem(50)}
                      color={theme.colors.red[6]}
                      stroke={1.5}
                    />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <IconCloudUpload
                      size={rem(50)}
                      color={
                        theme.colorScheme === "dark"
                          ? theme.colors.dark[0]
                          : theme.black
                      }
                      stroke={1.5}
                    />
                  </Dropzone.Idle>
                  {/* </Center> */}
                </Group>

                <Text ta="center" fw={700} fz="lg" mt="xl">
                  <Dropzone.Accept>Drop files here</Dropzone.Accept>
                  <Dropzone.Reject>
                    Only one Image with a size of less than 4.28 MB
                    (4.394 KB, 4.500.000 B)!
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    Drag&apos;n&apos;drop your Grow Header Image here to
                    upload!
                  </Dropzone.Idle>
                </Text>
                <Text ta="center" fz="sm" my="xs" c="dimmed">
                  For now we only can accept one <i>.jpg/.png/.gif</i>
                  image file, that is less than 4.28 MB (4.394 KB,
                  4.500.000 B)! in size.
                </Text>
              </Box>
            </Dropzone>
          </Box>
        )}

        {/* // Report form */}
        <form
          onSubmit={form.onSubmit((values) => {
            // send imageId as formField so that the report can be related
            form.setValues({ imageId: imageId });
            tRPCcreateReport(values);
          }, handleErrors)}
        >
          {/* <Box>form.values.title: {form.values.title}</Box> */}

          <Input
            hidden
            type="text"
            {...form.getInputProps("imageId")}
            value={imageId}
          />
          <Textarea
            label="Bockquote cite:"
            description="This appears at the top of your Grow's main header image"
            withAsterisk
            placeholder="A journey through the wonderful world of cannabis cultivation!"
            mt="sm"
            autosize
            minRows={3}
            {...form.getInputProps("description")}
          />
          <TextInput
            label="Title:"
            description="This appears as headline on your Grow's main details page"
            withAsterisk
            mt="sm"
            {...form.getInputProps("title")}
          />

          <Group position="right" mt="xl">
            <Button
              type="submit"
              w={140}
              variant="outline"
              disabled={!form.isValid()}
            >
              Continue
            </Button>
          </Group>
        </form>
      </Container>
    </>
  );
}

export default Form;
