import {
  Box,
  Container,
  LoadingOverlay,
  Paper,
  Space,
  Title,
  rem,
  useMantineTheme,
} from "@mantine/core";
import type { Dispatch, SetStateAction } from "react";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconArrowBigLeft, IconArrowBigRight } from "@tabler/icons-react";
import { Image, Text } from "@mantine/core";

import { Carousel } from "@mantine/carousel";
import type { FileWithPath } from "@mantine/dropzone";
import type { Report } from "~/types";
import { handleMultipleDrop } from "~/helpers/handleMultipleDrop";
import { useState } from "react";

interface ImageUploaderProps {
  report: Report;
  imageIds: string[];
  setImageIds: Dispatch<SetStateAction<string[]>>;
}

const ImageUploader = (props: ImageUploaderProps) => {
  const { report, imageIds, setImageIds } = props;
  const [imagePublicIds, setImagePublicIds] = useState<string[]>([]);
  const [cloudUrls, setCloudUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const theme = useMantineTheme();

  const [files, setFiles] = useState<FileWithPath[]>([]);

  const previews = cloudUrls.map((cloudUrl, index) => {
    // const imageUrl = URL.createObjectURL(file);
    return (
      <Carousel.Slide key={index}>
        <Image
          src={cloudUrl}
          imageProps={{ onLoad: () => URL.revokeObjectURL(cloudUrl) }}
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
      report,
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
          <Title order={3}>Append some images to this update</Title>
          <div>
            <Box className="relative">
              <LoadingOverlay visible={isUploading} />
              <Box>
                <Dropzone
                  accept={IMAGE_MIME_TYPE}
                  onDrop={handleMultipleDropWrapper}
                >
                  <Text align="center">Drop images for this update here</Text>
                </Dropzone>
                <Space h="sm" />
                <Carousel
                  withIndicators
                  height={90}
                  previousControlIcon={
                    <IconArrowBigLeft
                      color={theme.colors.orange[7]}
                      size={36}
                      stroke={2}
                    />
                  }
                  nextControlIcon={
                    <IconArrowBigRight
                      color={theme.colors.orange[7]}
                      size={36}
                      stroke={2}
                    />
                  }
                  slideSize="20%"
                  slideGap="xs"
                  loop
                  align="start"
                  breakpoints={[
                    { maxWidth: "md", slideSize: "25%" },
                    { maxWidth: "sm", slideSize: "25%" },
                    { maxWidth: "xs", slideSize: "50%" },
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
          {/* 
          <Group position="right" mt="xl">
            <Button w={180} variant="outline" type="submit">
              Upload Images
            </Button>
          </Group> */}
        </Box>
      </Paper>
    </Container>
  );
};

export default ImageUploader;
