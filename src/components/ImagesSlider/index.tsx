import { Carousel } from "@mantine/carousel";
import { Image, Paper, useMantineTheme } from "@mantine/core";
import {
  IconArrowBigLeft,
  IconArrowBigRight,
} from "@tabler/icons-react";

import React from "react";

interface ImagesSliderProps {
  cloudUrls: string[];
}

const ImagesSlider = (props: ImagesSliderProps) => {
  const { cloudUrls } = props;

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

  return (
    <>
      <Paper withBorder>
        <Carousel
          withIndicators
          height={110}
          previousControlIcon={
            <IconArrowBigLeft
              color={theme.colors.orange[7]}
              size={28}
              stroke={2}
            />
          }
          nextControlIcon={
            <IconArrowBigRight
              color={theme.colors.orange[7]}
              size={28}
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
      </Paper>
    </>
  );
};

export default ImagesSlider;
