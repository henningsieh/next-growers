import { Carousel } from "@mantine/carousel";
import { Box, Image, useMantineTheme } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import type { EmblaCarouselType } from "embla-carousel-react";

import { useEffect, useState } from "react";

interface CardProps {
  images: string[];
}
export function PostImagesCarousel({ images }: CardProps) {
  const theme = useMantineTheme();

  /*****************************************************************************
   * ISSUE: embla carousel is init before the animation ends
   * which causes embla to calculate slides offset incorrectly.
   * - https://github.com/mantinedev/mantine/issues/2041#issuecomment-1207486779
   *
   * FIX is here:
   *****************************************************************************/
  const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);
  useEffect(() => {
    setTimeout(() => embla && embla.reInit(), 200);
  }, [embla]);
  /*****************************************************************************/

  const slides = images.map((url, index) => (
    <Carousel.Slide key={index}>
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          height: "89vh",
        }}
      >
        <Image fit="contain" height="88vh" alt="alt" src={url} />
      </Box>
    </Carousel.Slide>
  ));

  return (
    <Carousel
      /***********************************
       * part of embla carousel ISSUE fix:
       */
      getEmblaApi={setEmbla}
      /**********************************/
      slideGap="md"
      align="center"
      slideSize="100%"
      initialSlide={0}
      previousControlIcon={
        <IconChevronLeft
          className="cursor-default"
          color={theme.colors.orange[7]}
          size={44}
          stroke={4}
        />
      }
      nextControlIcon={
        <IconChevronRight
          className="cursor-default"
          color={theme.colors.orange[7]}
          size={48}
          stroke={4}
        />
      }
    >
      {slides}
    </Carousel>
  );
}
