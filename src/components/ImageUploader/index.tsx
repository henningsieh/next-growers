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

import { Carousel } from "@mantine/carousel";
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
      <Carousel.Slide key={index}>
        <Image
          src={imageUrl}
          imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
          alt={`upload preview id ${index} `}
        />
      </Carousel.Slide>
    );
  });

  const handleMultipleDropWrapper = (files: FileWithPath[]) => {
    setIsUploading(true);
    console.debug("handleMultipleDropWrapper", files);
    setFiles(files);

    // console.debug("handelDropWrapper", files);

    // handleMultipleDrop calls the new /api/multi-upload endpoint
    handleMultipleDrop(
      files,
      reportId,
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
        <Box className="space-y-2">
          <Title order={3}>Upload images to this update </Title>
          <div>
            <Box className="relative">
              <LoadingOverlay visible={isUploading} />
              <Dropzone
                accept={IMAGE_MIME_TYPE}
                onDrop={handleMultipleDropWrapper}
              >
                <Text align="center">Drop images for this update here</Text>
              </Dropzone>

              <Box>
                <Carousel
                  withIndicators
                  height={200}
                  slideSize="33.333333%"
                  slideGap="md"
                  loop
                  align="start"
                  breakpoints={[
                    { maxWidth: "md", slideSize: "25%" },
                    { maxWidth: "sm", slideSize: "50%", slideGap: 0 },
                  ]}
                >
                  {previews}
                  {/* ...other slides */}
                </Carousel>
              </Box>
              {/* 
              <SimpleGrid
                cols={4}
                breakpoints={[{ maxWidth: "xs", cols: 1 }]}
                // mt={previews.length > 0 ? "xl" : 0}
              >
                {previews}
              </SimpleGrid> */}
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
