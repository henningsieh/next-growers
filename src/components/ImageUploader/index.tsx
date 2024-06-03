import {
  Box,
  Container,
  LoadingOverlay,
  Paper,
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
  getFileUploadCloudinaryMaxFileSize,
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
          {/* <Group position="left">
            <IconCamera color={theme.colors.growgreen[4]} />
            <Title order={4}>Append images</Title>
          </Group> */}
          <Box>
            <Box className="relative">
              <LoadingOverlay visible={isSaving} />
              <Box>
                <Dropzone
                  accept={IMAGE_MIME_TYPE}
                  onDrop={(files) => {
                    void handleMultipleDropWrapper(files);
                  }}
                  maxSize={getFileUploadCloudinaryMaxFileSize()}
                  maxFiles={getFileUploadMaxFileCount()}
                  onReject={(files: FileRejection[]) => {
                    let tooManyFilesErrorShown = false;
                    files.forEach((file) => {
                      if (file.errors[0].code === "too-many-files") {
                        if (!tooManyFilesErrorShown) {
                          notifications.show(
                            fileUploadMaxFileCountErrorMsg(
                              files.length,
                              getFileUploadMaxFileCount()
                            )
                          );
                          tooManyFilesErrorShown = true;
                        }
                      } else {
                        notifications.show(
                          fileUploadMaxFileSizeErrorMsg(
                            file.file.name,
                            file.file.size / 1024 ** 2
                          )
                        );
                      }
                    });
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
