import {
  Box,
  Button,
  Container,
  Group,
  Paper,
  Title,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { Image, SimpleGrid, Text } from "@mantine/core";

import type { FileWithPath } from "@mantine/dropzone";
import { useState } from "react";

interface ImageUploaderProps {
  reportId: string;
}

const ImageUploader = (props: ImageUploaderProps) => {
  const { reportId } = props;

  const theme = useMantineTheme();

  const [files, setFiles] = useState<FileWithPath[]>([]);

  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <>
        <Image
          key={index}
          src={imageUrl}
          imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
          alt={`upload preview id ${index} `}
        />
        {imageUrl}
      </>
    );
  });

  const handelDropWrapper = (files: FileWithPath[]) => {
    setFiles(files);
    console.debug(files);
  };

  return (
    <Container p={0} size="md">
      <Paper p="xs" withBorder>
        <Title order={3}>Upload images to this update </Title>
        <Box className="space-y-2">
          <div>
            <Dropzone accept={IMAGE_MIME_TYPE} onDrop={handelDropWrapper}>
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
