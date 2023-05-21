import {
  Box,
  Button,
  Container,
  Group,
  LoadingOverlay,
  Paper,
  Title,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { Image, SimpleGrid, Text } from "@mantine/core";

import type { FileWithPath } from "@mantine/dropzone";
import { handleMultipleDrop } from "~/helpers/handleMultipleDrop";
import { useState } from "react";

interface ImageUploaderProps {
  reportId: string;
}

const ImageUploader = (props: ImageUploaderProps) => {
  const { reportId } = props;
  const [imageIds, setImageIds] = useState<string[]>([]);
  const [imagePublicIds, setImagePublicIds] = useState<string[]>([]);
  const [cloudUrls, setCloudUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const theme = useMantineTheme();

  const [files, setFiles] = useState<FileWithPath[]>([]);

  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Image
        key={index}
        src={imageUrl}
        imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
        alt={`upload preview id ${index} `}
      />
    );
  });

  const handleMultipleDropWrapper = (files: FileWithPath[]) => {
    setIsUploading(true);
    setFiles(files);

    // console.debug("handelDropWrapper", files);

    // handleMultipleDrop calls the new /api/multi-upload endpoint
    handleMultipleDrop(
      files,
      setImageIds,
      setImagePublicIds,
      setCloudUrls,
      setIsUploading
    ).catch((error) => {
      console.debug(error);
    });
  };

  return (
    <Container p={0} size="md">
      <Paper p="xs" withBorder>
        <Title order={3}>Upload images to this update </Title>
        <Box className="space-y-2">
          <div>
            <Box className="relative">
              <LoadingOverlay visible={isUploading} />
              <Dropzone
                accept={IMAGE_MIME_TYPE}
                onDrop={handleMultipleDropWrapper}
              >
                <Text align="center">Drop images for this update here</Text>
              </Dropzone>

              <Box>Preview Carousel</Box>

              <SimpleGrid
                cols={4}
                breakpoints={[{ maxWidth: "xs", cols: 1 }]}
                // mt={previews.length > 0 ? "xl" : 0}
              >
                {previews}
              </SimpleGrid>
            </Box>
          </div>
          <Group position="right" mt="xl">
            <Button w={180} variant="outline" type="submit">
              Upload Images
            </Button>
          </Group>
        </Box>
      </Paper>
    </Container>
  );
};

export default ImageUploader;
