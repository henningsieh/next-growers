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
import type { FileWithPath } from "@mantine/dropzone";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { env } from "~/env.mjs";
import { fileUploadErrorMsg, httpStatusErrorMsg } from "~/messages";

import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
} from "react";

import { useSession } from "next-auth/react";

import DragAndSortGrid from "~/components/Atom/DragAndSortGrid";

import type {
  CloudinaryResonse, // IsoReportWithPostsFromDb,
} from "~/types";

import { api } from "~/utils/api";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { handleMultipleDrop } from "~/utils/helperUtils";

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
  maxFiles?: number;
  maxSize?: number;
  setImageIds: Dispatch<SetStateAction<string[]>>;
  //setCloudinaryImages: Dispatch<SetStateAction<CloudinaryResonse[]>>;
  isUploading: boolean;
  setIsUploading: Dispatch<SetStateAction<boolean>>;
}

export default function ImageUploader({
  //report,
  images,
  setImages,
  //setImageIds,
  //setCloudinaryImages,
  isUploading,
  setIsUploading,
  maxFiles,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  maxSize,
}: ImageUploaderProps) {
  const { data: session, status } = useSession();
  const _theme = useMantineTheme();

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [imagesToUploadToCloudinary, setImagesToUploadToCloudinary] =
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
        // Set ImagesToUpload to an empty array
        setImagesToUploadToCloudinary([]);

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
      void imagesToUploadToCloudinary.map((image) => {
        tRPCcreateImage({
          cloudUrl: image.secure_url,
          publicId: image.public_id,
          ownerId: session.user.id,
        });
      });
    }
  }, [
    imagesToUploadToCloudinary,
    isUploading,
    session?.user.id,
    status,
    setImages,
    tRPCcreateImage,
  ]);

  const handleMultipleDropWrapper = (fileWithPath: FileWithPath[]) => {
    setIsSaving(true);
    handleMultipleDrop(
      fileWithPath,
      setIsUploading,
      setImagesToUploadToCloudinary
    ).catch((error) => {
      console.error(error);
    });
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
                  onDrop={handleMultipleDropWrapper}
                  maxFiles={maxFiles}
                  //maxSize={maxSize}
                  onReject={(files) => {
                    files.forEach((file) => {
                      const fileSizeInMB = (
                        file.file.size /
                        1024 ** 2
                      ).toFixed(2);
                      notifications.show(
                        fileUploadErrorMsg(
                          file.file.name,
                          fileSizeInMB,
                          env.NEXT_PUBLIC_FILE_UPLOAD_MAX_SIZE
                        )
                      );
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
