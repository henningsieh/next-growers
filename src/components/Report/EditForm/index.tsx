import {
  ActionIcon,
  Box,
  Button,
  Container,
  createStyles,
  Grid,
  Group,
  LoadingOverlay,
  MultiSelect,
  rem,
  Select,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconCalendar,
  IconCloudUpload,
  IconDownload,
  IconFileAlert,
  IconHome,
  IconTrashXFilled,
  IconX,
} from "@tabler/icons-react";

import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { ImagePreview } from "~/components/Atom/ImagePreview";

import type { EditReportFormProps } from "~/types";
import { Environment } from "~/types";

import { handleDrop } from "~/helpers";
import { InputEditReportForm } from "~/helpers/inputValidation";

import { api } from "~/utils/api";

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

export function ProtectedEditReportForm(props: EditReportFormProps) {
  const {
    report: reportfromProps,
    strains: allStrains,
    user: user,
  } = props;

  const router = useRouter();

  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const [strainsSarchValue, onSttrinsSearchChange] = useState("");
  const { classes, theme } = useStyles();
  const openReference = useRef<() => void>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isUploading, setIsUploading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [report, setReport] = useState(reportfromProps);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [reportTitle, setReportTitle] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [reportDescription, setReportDescription] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imageId, setImageId] = useState(
    reportfromProps.image?.id as string
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imagePublicId, setImagePublicId] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cloudUrl, setCloudUrl] = useState(
    reportfromProps.image?.cloudUrl as string
  );

  const trpc = api.useUtils();
  const { mutate: tRPCsaveReport } = api.reports.saveReport.useMutation(
    {
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
      onSuccess: async (savedReport) => {
        toast.success("Your report was successfully saved");
        console.debug(savedReport);
        // Navigate to the new report page
        // void router.push(`/grow-report/${savedReport.id}`);
        await trpc.reports.getIsoReportWithPostsFromDb.invalidate();
        trpc.reports.getIsoReportWithPostsFromDb.getData();
      },
      // Always refetch after error or success:
      onSettled: () => {
        console.log("END api.reports.saveReport.useMutation");
      },
    }
  );

  const editReportForm = useForm({
    validate: zodResolver(InputEditReportForm),
    validateInputOnChange: true,
    initialValues: {
      id: report?.id as string,
      title: report?.title as string,
      imageId: imageId,
      description: report?.description as string,
      createdAt: new Date(report?.createdAt), // new Date(),// Add the createdAt field with the current date
      strains: report.strains.map((strain) => strain.id),
      environment: report.environment as keyof typeof Environment,
    },
  });

  const submitEditReportForm = (values: {
    id: string;
    title: string;
    imageId: string;
    description: string;
    strains: string[];
    environment: keyof typeof Environment;
    createdAt: Date;
  }) => {
    tRPCsaveReport(values);
  };

  const handleErrors = (errors: typeof editReportForm.errors) => {
    if (errors.id) {
      toast.error(errors.id as string);
    }
    if (errors.title) {
      toast.error(errors.title as string);
    }
    if (errors.imageId) {
      toast.error(errors.imageId as string);
    }
    if (errors.environment) {
      toast.error(errors.environment as string);
    }
  };

  // Update "imageId" state, if "imageId" form field value changes
  useEffect(() => {
    editReportForm.setFieldValue("imageId", imageId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageId]);

  const handleDropWrapper = (files: File[]): void => {
    // handleDrop calls the/api/upload endpoint
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

  return (
    <>
      {reportfromProps && (
        <Container
          p={0}
          mt={4}
          className="flex w-full flex-col space-y-10"
        >
          {/*// Upload Panel */}
          {cloudUrl ? (
            <>
              {/*// Image Preview */}
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
                  views={183}
                  comments={89}
                  imageUrl={cloudUrl}
                  authorName={user.name as string}
                  authorImageUrl={user.image as string}
                  title={editReportForm.values.title}
                  description={editReportForm.values.description}
                  publicLink={`/grow/${report.id as string}`}
                />
              </Box>
            </>
          ) : (
            /*// Dropzone */
            <Box className={classes.wrapper}>
              <LoadingOverlay
                visible={isUploading}
                transitionDuration={600}
                overlayBlur={2}
              />
              <Dropzone
                className={classes.dropzone}
                h={rem(280)}
                multiple={false} // only one header image!
                openRef={openReference}
                onDrop={handleDropWrapper}
                maxSize={4500000} // Vercel production environment post size limit which is 4.500.000 byte
                accept={[
                  MIME_TYPES.jpeg,
                  MIME_TYPES.png,
                  MIME_TYPES.gif,
                ]}
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
                            ? theme.colors.dark[0]
                            : theme.black
                        }
                        stroke={1.6}
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
                      Drag&apos;n&apos;drop your Grow Header Image here
                      to upload!
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

          <form
            onSubmit={editReportForm.onSubmit((values) => {
              submitEditReportForm(values);
            }, handleErrors)}
          >
            <Box className="space-y-4">
              <Textarea
                label="Bockquote cite:"
                description="This appears at the top of your Grow's main header image"
                placeholder="My journey through the wonderful world of cannabis cultivation!"
                withAsterisk
                mt="sm"
                autosize
                minRows={3}
                {...editReportForm.getInputProps("description")}
              />
              <TextInput
                label="Title:"
                description="This appears as headline on your Grow's main details page"
                withAsterisk
                {...editReportForm.getInputProps("title")}
              />
              <Select
                label="Environment"
                description="Environment of your Grow"
                data={Object.keys(Environment).map((key) => ({
                  value: key,
                  label: Environment[key as keyof typeof Environment],
                }))}
                withAsterisk
                {...editReportForm.getInputProps("environment")}
                className="w-full"
                icon={<IconHome size="1.2rem" />}
              />
              <Grid gutter="sm">
                <Grid.Col xs={12} sm={4} md={4} lg={4} xl={4}>
                  <DateInput
                    label="Grow start date:"
                    description="'Created at' date of your Grow"
                    valueFormat="MMM DD, YYYY HH:mm"
                    maxDate={new Date()}
                    // maxDate={dayjs(new Date()).add(1, 'month').toDate()}
                    // className="w-full"
                    icon={<IconCalendar size="1.2rem" />}
                    withAsterisk
                    {...editReportForm.getInputProps("createdAt")}
                    onChange={(selectedDate: Date) => {
                      editReportForm.setFieldValue(
                        "createdAt",
                        selectedDate
                      );
                    }}
                  />
                </Grid.Col>
                <Grid.Col xs={12} sm={8} md={8} lg={8} xl={8}>
                  {allStrains && (
                    <MultiSelect
                      label="Strain(s):"
                      description="Select all strain(s) of your Grow"
                      placeholder="Pick strains of your Grow"
                      {...editReportForm.getInputProps("strains")}
                      data={allStrains.map((strain) => ({
                        value: strain.id,
                        label: strain.name,
                      }))}
                      searchable
                      searchValue={strainsSarchValue}
                      onSearchChange={onSttrinsSearchChange}
                      nothingFound="Nothing found"
                    />
                  )}
                </Grid.Col>
              </Grid>

              <Group position="right" mt="xl">
                <Button
                  w={160}
                  type="submit"
                  leftIcon={
                    <IconCloudUpload stroke={1.6} size="1.2rem" />
                  }
                >
                  {t("common:report-save-button")}
                </Button>
              </Group>
            </Box>
          </form>
        </Container>
      )}
    </>
  );
}
