import {
  ActionIcon,
  Box,
  Button,
  Center,
  Container,
  Group,
  Input,
  Text,
  TextInput,
  Textarea,
  createStyles,
  rem,
} from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import {
  IconCloudUpload,
  IconDownload,
  IconPhotoCancel,
  IconTrashXFilled,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useRef } from "react";
import { useForm, zodResolver } from "@mantine/form";

import AccessDenied from "~/components/Atom/AccessDenied";
import { ImagePreview } from "~/components/Atom/ImagePreview";
import Loading from "~/components/Atom/Loading";
import type { User } from "next-auth";
import { api } from "~/utils/api";
import { handleDrop } from "~/helpers";
import { reportInput } from "~/types";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState } from "react";

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

interface AddFormProps {
  user: User;
}

function Form({ user }: AddFormProps) {
  const { data: session } = useSession();

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

  // Update the "imageId" state when the value of the "imageId" field in the form changes
  useEffect(() => {
    form.setFieldValue("imageId", imageId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageId]);

  const handleDropWrapper = (files: File[]): void => {
    // handleDrop calls the /api/upload endpoint
    setIsUploading(true);
    handleDrop(
      files,
      setImageId,
      setImagePublicId,
      setCloudUrl,
      setIsUploading
    ).catch((error) => {
      // ERROR 500 IN PRODUCTION BROWSER CONSOLE???
      console.log(error);
    });
  };

  const { mutate: tRPCcreateReport } = api.reports.create.useMutation({
    onMutate: (newReportDB) => {
      console.log("END api.reports.create.useMutation");
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
      void router.push(`/account/reports/${newReportDB.id}`);
    },
    // Always refetch after error or success:
    onSettled: () => {
      console.log("END api.reports.create.useMutation");
    },
  });

  const handleErrors = (errors: typeof form.errors) => {
    // console.log(errors);
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
    validate: zodResolver(reportInput),
    validateInputOnChange: true,
    initialValues: {
      title: "",
      description: "",
      imageId: "",
    },
  });

  if (!session) return <AccessDenied />;

  return (
    <>
      <Container
        size="sm"
        px={0}
        className="flex w-full flex-col space-y-4"
        mx="auto"
      >
        {/* // Upload Panel */}
        {isUploading && <Loading />}
        {cloudUrl ? (
          <>
            <Container className="relative" size="md" px={0}>
              <Box
                className="
              absolute
              right-2
              top-2
              z-10
                flex                
                justify-end  
              "
              >
                <ActionIcon
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
                image={cloudUrl}
                title={form.values.title}
                description={form.values.description}
                publicLink="#"
                authorName={user.name as string}
                authorImageUrl={user.image as string}
                comments={42}
                views={183}
              />
            </Container>
          </>
        ) : (
          <div className={classes.wrapper}>
            <Dropzone
              h={rem(280)}
              multiple={false} // only one header image!
              openRef={openReference}
              onDrop={handleDropWrapper}
              onChange={(e) => {
                alert(e.currentTarget);
              }}
              className={classes.dropzone}
              // radius="md"
              accept={[MIME_TYPES.jpeg, MIME_TYPES.png, MIME_TYPES.gif]}
              maxSize={10 * 1024 ** 2}
            >
              <div style={{ pointerEvents: "none" }}>
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
                    Only one Images, less than 10mb
                  </Dropzone.Reject>
                  <Dropzone.Idle>Upload Header Image</Dropzone.Idle>
                </Text>
                <Text ta="center" fz="sm" my="xs" c="dimmed">
                  Drag&apos;n&apos;drop your image here to upload!
                  <br />
                  We can accept only one <i>.jpg/.png/.gif</i> file that is less
                  than 10mb in size.
                </Text>
              </div>
            </Dropzone>
          </div>
        )}

        {/* // Report form */}
        <form
          onSubmit={form.onSubmit((values) => {
            console.log(form.values);
            // send imageId as formField so that the report can be related
            form.setValues({ imageId: imageId });
            tRPCcreateReport(values);
          }, handleErrors)}
        >
          {/* <div>form.values.title: {form.values.title}</div> */}

          <Input
            hidden
            type="text"
            {...form.getInputProps("imageId")}
            value={imageId}
          />
          <TextInput
            withAsterisk
            label="Report title: "
            placeholder="John Doe"
            mt="sm"
            {...form.getInputProps("title")}
          />
          <Textarea
            withAsterisk
            label="Report description:"
            placeholder="So sit back, relax, and enjoy the ride as we take you on a journey through the wonderful world of cannabis cultivation!"
            mt="sm"
            autosize
            minRows={6}
            {...form.getInputProps("description")}
          />

          <Group position="right" mt="xl">
            <Button type="submit" disabled={!form.isValid()}>
              Create Report
            </Button>
          </Group>
        </form>
      </Container>
    </>
  );
}

export default Form;
