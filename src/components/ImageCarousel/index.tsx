import { Carousel } from "@mantine/carousel";
import {
  Box,
  createStyles,
  getStylesRef,
  useMantineTheme,
} from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import type { EmblaCarouselType } from "embla-carousel-react";

import Image from "next/image";

interface CardProps {
  images: (string | null)[];
  initialSlide: number;
  largeScreen: boolean;
  setEmbla: React.Dispatch<
    React.SetStateAction<EmblaCarouselType | null>
  >;
}

const useStyles = createStyles(() => ({
  controls: {
    ref: getStylesRef("controls"),
    transition: "opacity 150ms ease",
    opacity: 0,
  },

  root: {
    "&:hover": {
      [`& .${getStylesRef("controls")}`]: {
        opacity: 1,
      },
    },
  },
}));

export function PostImagesCarousel({
  images,
  largeScreen,
  initialSlide,
  setEmbla,
}: CardProps) {
  const slides = images.map((url, index) => (
    <Carousel.Slide key={index}>
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: largeScreen ? "96vh" : "86vh",
        }}
      >
        <Image
          fill
          alt="alt"
          src={url as string}
          className="object-contain"
        />
      </Box>
    </Carousel.Slide>
  ));
  const theme = useMantineTheme();
  const { classes } = useStyles();
  return (
    <>
      {!largeScreen && (
        <Box
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            marginBottom: "10px", // Add some spacing
          }}
        >
          <IconChevronLeft
            className="cursor-default"
            color={theme.colors.gray[6]}
            size={54}
            stroke={2.2}
          />
          <Box mx={"xl"}>SWIPE</Box>
          <IconChevronRight
            className="cursor-default"
            color={theme.colors.gray[6]}
            size={54}
            stroke={2.2}
          />
        </Box>
      )}
      <Carousel
        classNames={classes}
        getEmblaApi={setEmbla}
        slideGap="md"
        align="center"
        slideSize="100%"
        initialSlide={initialSlide}
        previousControlIcon={
          <IconChevronLeft
            className="cursor-default"
            color={theme.colors.orange?.[7]}
            size={54}
            stroke={2.2}
          />
        }
        nextControlIcon={
          <IconChevronRight
            className="cursor-default"
            color={theme.colors.orange?.[7]}
            size={54}
            stroke={2.2}
          />
        }
      >
        {slides}
      </Carousel>
    </>
  );
}
