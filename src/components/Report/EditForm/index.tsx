import {
  ActionIcon,
  Box,
  Button,
  Container,
  Group,
  Input,
  LoadingOverlay,
  MultiSelect,
  NumberInput,
  Text,
  TextInput,
  createStyles,
  rem,
} from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import {
  IconCloudUpload,
  IconDeviceFloppy,
  IconDownload,
  IconTrashXFilled,
  IconX,
} from "@tabler/icons-react";
import { Report, Strains } from "~/types";
import { useForm, zodResolver } from "@mantine/form";
import { useRef, useState } from "react";

import { ImagePreview } from "~/components/Atom/ImagePreview";
import { InputEditReport } from "~/helpers/inputValidation";
import { User } from "next-auth";
import { api } from "~/utils/api";
import { handleDrop } from "~/helpers";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { z } from "zod";

interface EditFormProps {
  report: Report;
  user: User;
  strains: Strains;
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

export function EditForm(props: EditFormProps) {
  const router = useRouter();
  const { classes, theme } = useStyles();
  const openReference = useRef<() => void>(null);
  const { report: reportfromProps, strains: allStrains, user: user } = props;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isUploading, setIsUploading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [report, setReport] = useState(reportfromProps);
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

  const trpc = api.useContext();
  const { mutate: tRPCsaveReport } = api.reports.saveReport.useMutation({
    onMutate: (savedReport) => {
      console.log("START api.reports.saveReport.useMutation");
      console.log("newReportDB", savedReport);
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newReport, context) => {
      toast.error("An error occured when saving your report");
      if (!context) return;
      console.debug(context);
    },
    onSuccess: (savedReport) => {
      toast.success("Your report was successfully saved");
      console.debug(savedReport);
      // Navigate to the new report page
      // void router.push(`/account/reports/${newReportDB.id}`);
    },
    // Always refetch after error or success:
    onSettled: () => {
      console.log("END api.reports.saveReport.useMutation");
    },
  });

  const form = useForm({
    validate: zodResolver(InputEditReport),
    initialValues: {
      id: report?.id,
      title: report?.title,
      description: report?.description,
      strains: report?.strains.map((strain) => strain.id),
    },
  });

  const submitEditReportForm = (values: {
    id: string;
    title: string;
    description: string;
    strains: string[];
  }) => {
    tRPCsaveReport(values);
    console.debug(values);
  };

  const handleErrors = (errors: typeof form.errors) => {
    console.log(errors);
    if (errors.id) {
      toast.error(errors.id as string);
    }
    if (errors.title) {
      toast.error(errors.title as string);
    }
    if (errors.imageId) {
      toast.error(errors.imageId as string);
    }
  };
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
      console.debug(error);
    });
  };
  const [strainsSarchValue, onSttrinsSearchChange] = useState("");
  return (
    <>
      {" "}
      {reportfromProps && (
        <Container mt="sm" className="flex w-full flex-col space-y-4">
          {/* // Upload Panel */}
          {reportfromProps.imageCloudUrl ? (
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
                  image={reportfromProps.imageCloudUrl}
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
            <div className={classes.wrapper}>
              <LoadingOverlay
                visible={isUploading}
                transitionDuration={600}
                overlayBlur={2}
              />
              <Dropzone
                h={rem(280)}
                multiple={false} // only one header image!
                openRef={openReference}
                onDrop={handleDropWrapper}
                onChange={(e) => {
                  console.debug(e.currentTarget);
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
                    We only can accept one <i>.jpg/.png/.gif</i> file that is
                    less than 4.5 MB in size.
                  </Text>
                </div>
              </Dropzone>
            </div>
          )}

          <form
            onSubmit={form.onSubmit((values) => {
              submitEditReportForm(values);
            }, handleErrors)}
          >
            {/* <Input hidden {...form.getInputProps("id")} /> */}
            <TextInput
              withAsterisk
              label="Bockquote cite (appears at the top):"
              mt="sm"
              {...form.getInputProps("description")}
            />
            <TextInput
              withAsterisk
              label="Title"
              {...form.getInputProps("title")}
            />

            <MultiSelect
              {...form.getInputProps("strains")}
              data={allStrains.map((strain) => ({
                value: strain.id,
                label: strain.name,
              }))}
              label="Strain(s) you are growing"
              placeholder="Pick strins"
              searchable
              searchValue={strainsSarchValue}
              onSearchChange={onSttrinsSearchChange}
              nothingFound="Nothing found"
            />

            <Group position="right" mt="xl">
              <Button w={180} variant="outline" type="submit">
                Save Grow
                <Box ml={12} mt={2}>
                  <IconDeviceFloppy size={20} />
                </Box>
              </Button>
            </Group>
          </form>
        </Container>
      )}
    </>
  );
}
