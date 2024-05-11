import {
  Box,
  Container,
  Group,
  LoadingOverlay,
  Paper,
  rem,
  Space,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import type { FileWithPath } from "@mantine/dropzone";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { IconCamera } from "@tabler/icons-react";
import { env } from "~/env.mjs";
import { fileUploadErrorMsg } from "~/messages";

import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

import DragAndSortGrid from "~/components/Atom/DragAndSortGrid";

import type { IsoReportWithPostsFromDb } from "~/types";

import { handleMultipleDrop } from "~/utils/helperUtils";

interface ImageUploaderProps {
  report: IsoReportWithPostsFromDb;
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
}

const ImageUploader = ({
  report,
  images,
  setImages,
  setImageIds,
  maxFiles,
  maxSize,
}: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const theme = useMantineTheme();

  const handleMultipleDropWrapper = (fileWithPath: FileWithPath[]) => {
    setIsUploading(true);
    handleMultipleDrop(
      fileWithPath,
      report,
      setImages,
      setImageIds,
      setIsUploading
    ).catch((error) => {
      console.debug(error);
    });
  };

  return (
    <Container p={0} size="md">
      <Paper p="xs" withBorder>
        <Box className="space-y-2">
          <Group position="left">
            <IconCamera color={theme.colors.growgreen[4]} />
            <Title order={4}>Append images</Title>
          </Group>
          <Box>
            <Box className="relative">
              <LoadingOverlay visible={isUploading} />
              <Box>
                <Dropzone
                  accept={IMAGE_MIME_TYPE}
                  onDrop={handleMultipleDropWrapper}
                  maxFiles={maxFiles}
                  maxSize={maxSize}
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
};

export default ImageUploader;
