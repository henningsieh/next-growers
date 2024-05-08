import type { Embla } from "@mantine/carousel";
import { Carousel, useAnimationOffsetEffect } from "@mantine/carousel";
import { Card, createStyles, Modal } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

import { useState } from "react";

import Image from "next/image";

import { PostImagesCarousel } from "~/components/ImageCarousel";

import type { IsoReportWithPostsFromDb } from "~/types";

interface ImagesSliderProps {
  grow: IsoReportWithPostsFromDb;
  cloudUrls: string[];
}

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[2],
  },
}));

const ImagesSlider = (props: ImagesSliderProps) => {
  // const router = useRouter();
  // const { locale: activeLocale } = router;
  // const { t } = useTranslation(activeLocale);

  const { cloudUrls } = props;

  const { classes, theme } = useStyles();

  const [opened, { open, close }] = useDisclosure(false);
  const [embla, setEmbla] = useState<Embla | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const TRANSITION_DURATION = 500;
  useAnimationOffsetEffect(embla, TRANSITION_DURATION);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    open();
  };
  const largeScreen = useMediaQuery(
    `(min-width: ${theme.breakpoints.lg})`
  );
  return (
    <Card className={classes.card} radius="sm" p={0} m={0} withBorder>
      <Modal
        className="content-center"
        fullScreen
        withCloseButton
        opened={opened}
        onClose={close}
        size="100%"
        transitionProps={{ duration: TRANSITION_DURATION }}
        overlayProps={{
          color:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[4],
          opacity: 0.66,
          blur: 3,
        }}
      >
        {/* big image overlay */}
        <PostImagesCarousel
          images={cloudUrls}
          largeScreen={largeScreen}
          initialSlide={selectedImageIndex}
          setEmbla={setEmbla}
        />
      </Modal>

      {/** small image slider */}
      <Carousel
        withIndicators
        height={152}
        slideGap="xs"
        align="start"
        slideSize="16%"
        previousControlIcon={
          <IconChevronLeft
            className="cursor-default"
            color={theme.colors.groworange[4]}
            size={36}
            stroke={2.2}
          />
        }
        nextControlIcon={
          <IconChevronRight
            className="cursor-default"
            color={theme.colors.groworange[4]}
            size={36}
            stroke={2.2}
          />
        }
        breakpoints={[
          { maxWidth: "xl", slideSize: "16%" },
          { maxWidth: "lg", slideSize: "20%" },
          { maxWidth: "md", slideSize: "33%" },
          { maxWidth: "sm", slideSize: "50%" },
          { maxWidth: "xs", slideSize: "50%" },
        ]}
      >
        {cloudUrls.map((cloudUrl, index) => (
          <Carousel.Slide key={index}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Image
                onClick={() => handleImageClick(index)}
                width={300}
                height={300}
                src={cloudUrl}
                alt={`update image id ${index}`}
                style={{ objectFit: "contain" }}
                className="cursor-pointer"
              />
            </div>
          </Carousel.Slide>
        ))}
      </Carousel>
    </Card>
  );
};

export default ImagesSlider;
