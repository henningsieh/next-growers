import { Carousel } from "@mantine/carousel";
import { Box, Image, useMantineTheme } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

interface CardProps {
  images: string[];
}
export function PostImagesCarousel({ images }: CardProps) {
  const theme = useMantineTheme();

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
      // style={{ display: "flex", alignItems: "center" }}
      initialSlide={0}
      loop
      slideSize="100%"
      slideGap="md"
      align="center"
      // slidesToScroll={1}
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
