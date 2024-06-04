import {
  Box,
  Container,
  createStyles,
  LoadingOverlay,
  Paper,
  Progress,
  rem,
  Space,
  Text,
  useMantineTheme,
} from "@mantine/core";
import type { FileRejection, FileWithPath } from "@mantine/dropzone";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import {
  fileUploadMaxFileCountErrorMsg,
  fileUploadMaxFileSizeErrorMsg,
  httpStatusErrorMsg,
} from "~/messages";

import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
} from "react";

import { useSession } from "next-auth/react";

import DragAndSortGrid from "~/components/Atom/DragAndSortGrid";

import type { CloudinaryResonse } from "~/types";

import { api } from "~/utils/api";
import {
  getFileUploadCloudinaryMaxFileSizeInByte,
  getFileUploadMaxFileCount,
  handleMultipleDrop,
} from "~/utils/helperUtils";

interface ImageUploaderProps {
  //report: IsoReportWithPostsFromDb;
  images: {
    id: string;
    publicId: string;
    cloudUrl: string;
    postOrder: number;
  }[];
  setImages: Dispatch<
    SetStateAction<
      {
        id: string;
        publicId: string;
        cloudUrl: string;
        postOrder: number;
      }[]
    >
  >;
  setImageIds: Dispatch<SetStateAction<string[]>>;
  isUploading: boolean;
  setIsUploading: Dispatch<SetStateAction<boolean>>;
}

export default function ImageUploader({
  images,
  setImages,
  isUploading,
  setIsUploading,
}: ImageUploaderProps) {
  const { data: session, status } = useSession();
  const _theme = useMantineTheme();

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [imagesUploadedToCloudinary, setImagesUploadedToCloudinary] =
    useState<CloudinaryResonse[]>([]);

  const [uploadProgress, setUploadProgress] = useState<
    {
      value: number;
      label: string;
    }[]
  >([]);

  const { mutate: tRPCcreateImage } = api.image.createImage.useMutation(
    {
      onError: (error) => {
        notifications.show(
          httpStatusErrorMsg(error.message, error.shape?.code)
        );
        console.error(error);
      },
      onSuccess: (newImage) => {
        !!newImage &&
          setImages((prevImages) => [
            ...prevImages,
            {
              id: newImage.id,
              publicId: newImage.publicId,
              cloudUrl: newImage.cloudUrl,
              postOrder: !!newImage.postOrder ? newImage.postOrder : 0,
            },
          ]);

        setImagesUploadedToCloudinary([]);
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

      setUploadProgress([]);
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

  const useStyles = createStyles((theme) => ({
    bar: {
      justifyContent: "flex-start", // Align label to the left
    },
    label: {
      paddingLeft: theme.spacing.xs,
      fontSize: 12,
      fontFamily: theme.fontFamilyMonospace,
    },
  }));

  const { classes, theme } = useStyles();

  return (
    <Container mt="sm" p={0} size="md">
      <Box
        fz={"lg"}
        fw={"normal"}
        color="#00ff00"
        sx={(theme) => ({
          // backgroundColor:
          //   theme.colorScheme === "dark"
          //     ? "rgba(0, 0, 0, 0)"
          //     : "rgba(255, 255, 255, .66)",
          color:
            theme.colorScheme === "dark"
              ? theme.colors.growgreen[4]
              : theme.colors.growgreen[6],
        })}
      >
        Images
      </Box>
      <Paper p="xs" withBorder>
        <Box className="space-y-2">
          <Box>
            {/* Your file upload input and button */}
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
            <Box className="relative">
              <LoadingOverlay
                loaderProps={{
                  size: "xl",
                  color: "growgreen.4",
                  variant: "oval",
                }}
                visible={isSaving}
              />
              <Box>
                <Dropzone
                  accept={IMAGE_MIME_TYPE}
                  onDrop={(files) => {
                    void handleMultipleDropWrapper(files);
                  }}
                  maxSize={getFileUploadCloudinaryMaxFileSizeInByte()}
                  maxFiles={getFileUploadMaxFileCount()}
                  onReject={(files: FileRejection[]) => {
                    console.error(files);
                    let tooManyFilesErrorShown = false;

                    files.forEach((file) => {
                      file.errors.map((error) => {
                        console.error(error.code);

                        if (error.code === "too-many-files") {
                          if (!tooManyFilesErrorShown) {
                            notifications.show(
                              fileUploadMaxFileCountErrorMsg(
                                files.length,
                                getFileUploadMaxFileCount()
                              )
                            );
                            // show error only once
                            tooManyFilesErrorShown = true;
                          }
                        } else if (error.code === "file-too-large") {
                          notifications.show(
                            fileUploadMaxFileSizeErrorMsg(
                              file.file.name,
                              file.file.size
                            )
                          );
                        } else if (error.code === "file-invalid-type") {
                          notifications.show(
                            httpStatusErrorMsg(
                              `File type of ${file.file.name} is not supported!`,
                              415
                            )
                          );
                        } else {
                          notifications.show(
                            httpStatusErrorMsg(
                              error.message,
                              error.code
                            )
                          );
                        }
                      });
                    });

                    // files.forEach((file) => {
                    //   if (
                    //     // too many files error
                    //     file.errors[0].code === "too-many-files"
                    //   ) {
                    //     if (!tooManyFilesErrorShown) {
                    //       notifications.show(
                    //         fileUploadMaxFileCountErrorMsg(
                    //           files.length,
                    //           getFileUploadMaxFileCount()
                    //         )
                    //       );
                    //       // show error only once
                    //       tooManyFilesErrorShown = true;
                    //     }
                    //   } else if (
                    //     // file too large error
                    //     file.errors[0].code === "file-too-large"
                    //   ) {
                    //     notifications.show(
                    //       fileUploadMaxFileSizeErrorMsg(
                    //         file.file.name,
                    //         file.file.size
                    //       )
                    //     );
                    //   } else if (
                    //     // file invalid type error
                    //     file.errors[0].code === "file-invalid-type"
                    //   ) {
                    //     notifications.show(
                    //       httpStatusErrorMsg(
                    //         `File type of ${file.file.name} is not supported!`,
                    //         415
                    //       )
                    //     );
                    //   } else {
                    //     file.errors.map((error) => {
                    //       console.error(error);
                    //       notifications.show(
                    //         httpStatusErrorMsg(
                    //           error.message,
                    //           error.code
                    //         )
                    //       );
                    //     });
                    //   }
                    // });
                  }}
                  sx={(theme) => ({
                    fontSize: theme.fontSizes.lg,
                    fontWeight: "bolder",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: 0,
                    minHeight: rem(80),
                    color: "white",
                    backgroundColor:
                      theme.colorScheme === "dark"
                        ? theme.colors.growgreen[5]
                        : theme.colors.growgreen[4],
                    "&:hover": {
                      backgroundColor:
                        theme.colorScheme === "dark"
                          ? theme.colors.growgreen[4]
                          : theme.colors.growgreen[3],
                    },
                    "&[data-accept]": {
                      color: theme.white,
                      backgroundColor: theme.colors.growgreen[4],
                    },

                    "&[data-reject]": {
                      color: theme.white,
                      backgroundColor: theme.colors.red[6],
                    },
                  })}
                >
                  <Text align="center">
                    Drop your Update images here!
                  </Text>
                </Dropzone>

                <Space h="sm" />

                <DragAndSortGrid
                  itemsToSort={images}
                  setImages={setImages}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
