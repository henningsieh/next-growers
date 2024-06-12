import {
  ActionIcon,
  Box,
  Button,
  Container,
  createStyles,
  Grid,
  Group,
  LoadingOverlay, // MultiSelect,
  Paper,
  Progress,
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

import type { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { ImagePreview } from "~/components/Atom/ImagePreview";

import type {
  CloudinaryResonse,
  IsoReportWithPostsFromDb,
  MantineSelectData, // Strains,
} from "~/types";
import { Environment } from "~/types";

import { api } from "~/utils/api";
import { handleMultipleDrop } from "~/utils/helperUtils";
import { InputEditReportForm } from "~/utils/inputValidation";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    alignItems: "center",
    height: "100%",
  },

  dropzone: {
    borderWidth: rem(1),
    padding: rem(5),
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
    justifyContent: "flex-start", // Align progess label to the left
  },
  label: {
    paddingLeft: theme.spacing.xs,
    fontSize: 12,
    fontFamily: theme.fontFamilyMonospace,
  },
}));

interface EditReportFormProps {
  user: User;
  report: IsoReportWithPostsFromDb;
  // strains: Strains | undefined;
}

export function EditReportForm({
  report: reportfromProps,
  // strains: allStrains,
  user: user,
}: EditReportFormProps) {
  const router = useRouter();

  const isNewReport = router.query.newReport as unknown as boolean;
  const { data: session, status } = useSession();

  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const { classes, theme } = useStyles();
  const openReference = useRef<() => void>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [cloudUrl, setCloudUrl] = useState(
    reportfromProps.image?.cloudUrl as string
  );
  const [uploadProgress, setUploadProgress] = useState<
    {
      value: number;
      label: string;
    }[]
  >([]);

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
        // Navigate to the edit strains page if isNewReport===true
        void router.push(
          {
            pathname: isNewReport
              ? `/account/grows/edit/${savedReport?.id as string}/addPlant`
              : `/grow/${savedReport?.id as string}`,

            //query: router.query
          },
          undefined, //router.asPath,
          { scroll: true, locale: activeLocale }
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
      // strains: reportfromProps.strains.map((strain) => strain.id),
      environment:
        reportfromProps.environment as keyof typeof Environment,
    },
  });

  const environmentSelectData: MantineSelectData = Object.keys(
    Environment
  ).map((key) => ({
    value: key,
    label: Environment[key as keyof typeof Environment],
  }));

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
        if (!!newImage) {
          setCloudUrl(newImage.cloudUrl);
          editReportForm.setFieldValue("imageId", newImage.id);
        }
      },
      onSettled: (_newImage) => {
        // indicate that saving process is ready:
        setImagesUploadedToCloudinary([]);
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

  const growstartdatePlaceholder = t(
    "common:report-form-growstartdate-placeholder"
  );
  // const strainsPlaceholder = t(
  //   "common:report-form-strains-placeholder"
  // );

  return (
    <>
      {reportfromProps && (
        <Container py="xl" px={0} className="flex flex-col space-y-2">
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
                  authorId={user.id}
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
                          size={92}
                          color={theme.colors.growgreen[4]}
                          stroke={2}
                        />
                      </Dropzone.Accept>
                      <Dropzone.Reject>
                        <IconX
                          size={92}
                          color={theme.colors.red[6]}
                          stroke={2}
                        />
                      </Dropzone.Reject>
                      <Dropzone.Idle>
                        <IconCloudUpload size={92} stroke={2} />
                      </Dropzone.Idle>
                      {/* </Center> */}
                    </Group>

                    <Text ta="center" fw={700} fz="lg" mt="xl">
                      <Dropzone.Accept>Drop files here</Dropzone.Accept>
                      <Dropzone.Reject>
                        Only one Image with a size of less than 10 MB!
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
                        image file, that is less than 10 MB in size.
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
                  size={20}
                  animate={isUploading}
                  my="xs"
                  classNames={classes}
                />
              ))}
            </>
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
                <Grid gutter="sm">
                  <Grid.Col xs={12} sm={7} md={8} lg={8} xl={8}>
                    <Select
                      label={t("common:report-form-environment-label")}
                      description={t(
                        "common:report-form-environment-description"
                      )}
                      data={environmentSelectData}
                      withAsterisk
                      {...editReportForm.getInputProps("environment")}
                      className="w-full"
                      icon={<IconHome size={20} />}
                    />
                  </Grid.Col>
                  <Grid.Col xs={12} sm={5} md={4} lg={4} xl={4}>
                    <DatePickerInput
                      label={t(
                        "common:report-form-growstartdate-label"
                      )}
                      description={t(
                        "common:report-form-growstartdate-description"
                      )}
                      // valueFormat="MMMM DD, YYYY HH:mm"
                      maxDate={new Date()}
                      // maxDate={dayjs(new Date()).add(1, 'month').toDate()}
                      // className="w-full"
                      icon={<IconCalendar size={20} />}
                      withAsterisk
                      {...editReportForm.getInputProps("createdAt")}
                      onChange={(selectedDate: Date) => {
                        editReportForm.setFieldValue(
                          "createdAt",
                          selectedDate
                        );
                      }}
                    />

                    {/* {allStrains && (
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
                    )} */}
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
                      <IconDeviceFloppy stroke={2.2} size={24} />
                    }
                  >
                    {isNewReport
                      ? t("common:report-save-new-button")
                      : t("common:report-save-button")}
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
