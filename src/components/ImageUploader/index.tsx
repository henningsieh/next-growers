import ImagesSlider from "../ImagesSlider";
import { Carousel } from "@mantine/carousel";
import {
  Box,
  Container,
  Group,
  LoadingOverlay,
  Paper,
  SimpleGrid,
  Space,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { Image, Text } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import type { FileWithPath } from "@mantine/dropzone";
import {
  IconArrowBigLeft,
  IconArrowBigRight,
  IconCamera,
} from "@tabler/icons-react";
import { handleMultipleDrop } from "~/helpers/handleMultipleDrop";

import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

import type { IsoReportWithPostsFromDb } from "~/types";

interface ImageUploaderProps {
  report: IsoReportWithPostsFromDb;
  cloudUrls: string[] | undefined;
  setImageIds: Dispatch<SetStateAction<string[]>>;
}

const ImageUploader = (props: ImageUploaderProps) => {
  const { report, cloudUrls: cloudUrlsFromProps, setImageIds } = props;
  const [cloudUrls, setCloudUrls] = useState<string[]>(
    cloudUrlsFromProps ? cloudUrlsFromProps : []
  );
  const [isUploading, setIsUploading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [files, setFiles] = useState<FileWithPath[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imagePublicIds, setImagePublicIds] = useState<string[]>([]);

  const theme = useMantineTheme();

  const previews = cloudUrls.map((cloudUrl, index) => {
    // const imageUrl = URL.createObjectURL(file);
    return (
      <Carousel.Slide key={index}>
        <Image
          src={cloudUrl}
          imageProps={{
            onLoad: () => URL.revokeObjectURL(cloudUrl),
          }}
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
          <Group position="left">
            <IconCamera color={theme.colors.orange[7]} />
            <Title order={4}>Append images</Title>
          </Group>
          <div>
            <Box className="relative">
              <LoadingOverlay visible={isUploading} />
              <Box>
                <Dropzone
                  accept={IMAGE_MIME_TYPE}
                  onDrop={handleMultipleDropWrapper}
                >
                  <Text align="center">
                    Drag & Drop images for this update here!
                  </Text>
                </Dropzone>

                <Space h="sm" />

                <ImagesSlider cloudUrls={cloudUrls} />
              </Box>
              {/* 
              <Carousel>
                <SimpleGrid
                  cols={4}
                  breakpoints={[{ maxWidth: "xs", cols: 1 }]}
                  // mt={previews.length > 0 ? "xl" : 0}
                >
                  {previews}
                </SimpleGrid>
              </Carousel>
                 */}
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
