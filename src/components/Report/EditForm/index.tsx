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
  Paper,
  rem,
  Select,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import type { FileWithPath } from "@mantine/dropzone";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconCalendar,
  IconCloudUpload,
  IconDeviceFloppy,
  IconDownload,
  IconHome,
  IconTrashXFilled,
  IconX,
} from "@tabler/icons-react";
import { httpStatusErrorMsg, saveGrowSuccessfulMsg } from "~/messages";

import { useEffect, useRef, useState } from "react";

import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { ImagePreview } from "~/components/Atom/ImagePreview";

import type { CloudinaryResonse, EditReportFormProps } from "~/types";
import { Environment } from "~/types";

import { api } from "~/utils/api";
import { handleMultipleDrop } from "~/utils/helperUtils";
import { InputEditReportForm } from "~/utils/inputValidation";

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

export function EditReportForm({
  report: reportfromProps,
  strains: allStrains,
  user: user,
}: EditReportFormProps) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const [strainsSarchValue, onSttrinsSearchChange] = useState("");
  const { classes, theme } = useStyles();
  const openReference = useRef<() => void>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [cloudUrl, setCloudUrl] = useState(
    reportfromProps.image?.cloudUrl as string
  );
  const { mutate: tRPCsaveReport } = api.reports.saveReport.useMutation(
    {
      onMutate: () => {
        console.debug("START api.reports.saveReport.useMutation");
      },
      onError: (error) => {
        notifications.show(
          httpStatusErrorMsg(error.message, error.data?.httpStatus)
        );
      },
      onSuccess: (savedReport) => {
        notifications.show(saveGrowSuccessfulMsg);
        // Navigate to the report page
        void router.push(
          {
            pathname: `/${activeLocale as string}/grow/${savedReport?.id as string}`,
          },
          undefined,
          { scroll: true }
        );
      },
      onSettled: () => {
        console.debug("END api.reports.saveReport.useMutation");
      },
    }
  );

  const editReportForm = useForm({
    validate: zodResolver(InputEditReportForm),
    validateInputOnChange: true,
    initialValues: {
      id: reportfromProps.id,
      title: reportfromProps.title,
      imageId: reportfromProps.image?.id as string,
      description: reportfromProps.description,
      createdAt: new Date(reportfromProps.createdAt), // new Date(),// Add the createdAt field with the current date
      strains: reportfromProps.strains.map((strain) => strain.id),
      environment:
        reportfromProps.environment as keyof typeof Environment,
    },
  });

  const handleErrors = (errors: typeof editReportForm.errors) => {
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
          editReportForm.setFieldValue("imageId", newImage.id);
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

    const result = await handleMultipleDrop(
      fileWithPath,
      setImagesUploadedToCloudinary
    ).catch((error) => {
      console.error(error);
    });

    setIsUploading(false); //triggers tRPCcreateImage in ImageUploader

    console.debug(result);
  };

  const growstartdatePlaceholder = t(
    "common:report-form-growstartdate-placeholder"
  );
  const strainsPlaceholder = t(
    "common:report-form-strains-placeholder"
  );

  return (
    <>
      {reportfromProps && (
        <Container py="xl" px={0} className="flex flex-col space-y-">
          {/*// Upload Panel */}
          {cloudUrl ? (
            <>
              {/*// Image Preview */}
              <Box className="relative" px={0}>
                <Box className="absolute right-2 top-2 z-50 flex justify-end">
                  <ActionIcon
                    title="delete this image"
                    onClick={() => {
                      // setImageId("");
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
                  authorImageUrl={
                    user.image
                      ? user.image
                      : `https://ui-avatars.com/api/?name=${
                          user.name as string
                        }`
                  }
                  title={editReportForm.values.title}
                  description={editReportForm.values.description}
                  publicLink={`/grow/${reportfromProps.id}`}
                />
              </Box>
            </>
          ) : (
            /*// Dropzone */
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
                multiple={false} // only one header image!
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
                    image file, that is less than 4.5 MB in size.
                  </Text>
                </Box>
              </Dropzone>
            </Box>
          )}
          <Paper m={0} p="sm" withBorder>
            <form
              onSubmit={editReportForm.onSubmit((values) => {
                tRPCsaveReport(values);
              }, handleErrors)}
            >
              <Box className="space-y-2">
                <Textarea
                  label={t("common:report-form-bockquote-label")}
                  description={t(
                    "common:report-form-bockquote-description"
                  )}
                  placeholder={growstartdatePlaceholder}
                  withAsterisk
                  mt="sm"
                  autosize
                  minRows={3}
                  {...editReportForm.getInputProps("description")}
                />
                <TextInput
                  label={t("common:report-form-title-label")}
                  description={t(
                    "common:report-form-title-description"
                  )}
                  withAsterisk
                  {...editReportForm.getInputProps("title")}
                />
                <Select
                  label={t("common:report-form-environment-label")}
                  description={t(
                    "common:report-form-environment-description"
                  )}
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
                    {/* <DatesProvider settings={{ locale: activeLocale }}> */}
                    <DatePickerInput
                      label="Grow start date:"
                      description="'Created at' date of your Grow"
                      // valueFormat="MMMM DD, YYYY HH:mm"
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
                    {/* </DatesProvider> */}
                  </Grid.Col>
                  <Grid.Col xs={12} sm={8} md={8} lg={8} xl={8}>
                    {allStrains && (
                      <MultiSelect
                        label={t("common:report-form-strains-label")}
                        description={t(
                          "common:report-form-strains-description"
                        )}
                        placeholder={strainsPlaceholder}
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

                <Group position="right" mt="md">
                  <Button
                    miw={180}
                    fz="lg"
                    variant="filled"
                    color="growgreen"
                    type="submit"
                    leftIcon={
                      <IconDeviceFloppy stroke={2.2} size="1.4rem" />
                    }
                  >
                    {t("common:report-save-button")}
                  </Button>
                </Group>
              </Box>
            </form>
          </Paper>
        </Container>
      )}
    </>
  );
}
