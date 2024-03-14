import { Carousel } from "@mantine/carousel";
import {
  Box,
  Image,
  createStyles,
  getStylesRef,
  useMantineTheme,
} from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import type { EmblaCarouselType } from "embla-carousel-react";

interface CardProps {
  images: string[];
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
          height: "86vh",
        }}
      >
        <Image fit="contain" height="86vh" alt="alt" src={url} />
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
            stroke={2.6}
          />
          <Box mx={"xl"}>SWIPE</Box>
          <IconChevronRight
            className="cursor-default"
            color={theme.colors.gray[6]}
            size={54}
            stroke={2.6}
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
            color={theme.colors.orange[6]}
            size={54}
            stroke={2.6}
          />
        }
        nextControlIcon={
          <IconChevronRight
            className="cursor-default"
            color={theme.colors.orange[6]}
            size={54}
            stroke={2.6}
          />
        }
      >
        {slides}
      </Carousel>
    </>
  );
}
