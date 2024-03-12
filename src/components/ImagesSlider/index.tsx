import { PostImagesCarousel } from "../Post/ImageCarousel";
import { Carousel } from "@mantine/carousel";
import {
  ActionIcon,
  Box,
  Card,
  Group,
  Overlay,
  Tooltip,
  createStyles,
} from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import {
  IconArrowBigLeft,
  IconArrowBigRight,
  IconFileSymlink,
  IconX,
} from "@tabler/icons-react";

import React, { useEffect, useState } from "react";

// import { useTranslation } from "react-i18next";
// import { useRouter } from "next/router";
import Image from "next/image";

interface ImagesSliderProps {
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

  const [overlayOpen, setOverlayOpen] = useState(false);

  const { cloudUrls } = props;
  const { classes, theme } = useStyles();

  const openOverlay = () => {
    console.debug(cloudUrls.length);
    setOverlayOpen(true);
  };
  const clickOutsideImage = useClickOutside(() =>
    setOverlayOpen(false)
  );

  // handle ESCAPE keyboard event to close Image Overlay
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.code === "Escape") {
        setOverlayOpen(false);
      }
    }
    document.addEventListener("keydown", handleEscapeKey);
    return () =>
      document.removeEventListener("keydown", handleEscapeKey);
  }, []);

  return (
    <Card className={classes.card} radius="sm" p={0} m={0} withBorder>
      {overlayOpen && (
        <Overlay
          opacity={0.66}
          className="flex justify-center items-center relative"
          style={{
            position: "fixed",
            width: "100vw",
            height: "100vh",
            maxHeight: "100vh",
          }}
        >
          <Box ref={clickOutsideImage}>
            <Box className="z-50 fixed left-4 bottom-4">
              <Tooltip label="close image [or press ESC]">
                <ActionIcon
                  variant="outline"
                  size={32}
                  className="cursor-default"
                  onMouseUp={() => setOverlayOpen(false)}
                >
                  <IconX size={32} stroke={2.4} color="orange" />
                </ActionIcon>
              </Tooltip>
            </Box>
            <PostImagesCarousel images={cloudUrls} />
          </Box>
        </Overlay>
      )}

      <Carousel
        withIndicators
        height={152}
        slideGap="xs"
        loop
        align="start"
        slideSize="14%"
        previousControlIcon={
          <IconArrowBigLeft
            className="cursor-default"
            color={theme.colors.dark[9]}
            size={32}
            stroke={2.2}
          />
        }
        nextControlIcon={
          <IconArrowBigRight
            className="cursor-default"
            color={theme.colors.dark[9]}
            size={32}
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
                onClick={() => openOverlay()}
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
