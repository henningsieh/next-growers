import { Carousel } from "@mantine/carousel";
import {
  ActionIcon,
  Box,
  Card,
  Group,
  Overlay,
  Paper,
  Tooltip,
  createStyles,
  useMantineTheme,
} from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import {
  IconArrowBigLeft,
  IconArrowBigRight,
  IconFileSymlink,
  IconX,
} from "@tabler/icons-react";

import React, { useState } from "react";

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
  const { cloudUrls } = props;
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayUrl, setOverlayUrl] = useState("");
  const clickOutsideImage = useClickOutside(() =>
    setOverlayOpen(false)
  );
  const { classes, theme } = useStyles();
  // const router = useRouter();
  // const { locale: activeLocale } = router;
  // const { t } = useTranslation(activeLocale);

  const openOverlay = (cloudUrl: string) => {
    setOverlayUrl(cloudUrl);
    setOverlayOpen(true);
  };

  return (
    <>
      <Card className={classes.card} radius="sm" p={0} m={0} withBorder>
        {overlayOpen && (
          <Overlay opacity={0.85}>
            <Overlay
              className="flex justify-center items-center transition-opacity duration-1300 ease-in-out"
              ref={clickOutsideImage}
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100vw",
                height: "100vh",
                maxHeight: "100vh",
              }}
            >
              <Box>
                <Image
                  rel="preload"
                  fill
                  className="object-contain px-4"
                  onClick={() => setOverlayOpen(false)}
                  alt=""
                  src={overlayUrl}
                />
              </Box>
              <Group
                className="absolute mb-4 px-4 right-0 bottom-0 bg-transparent"
                position="left"
              >
                <Tooltip label="open original">
                  <ActionIcon
                    size={26}
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => window.open(overlayUrl, "_blank")}
                  >
                    <IconFileSymlink
                      size={22}
                      stroke={1.6}
                      color="orange"
                    />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="close overlay">
                  <ActionIcon
                    variant="outline"
                    size={26}
                    className="cursor-default"
                    onClick={() => setOverlayOpen(false)}
                  >
                    <IconX size={25} stroke={1.6} color="orange" />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Overlay>
          </Overlay>
        )}
        <Carousel
          withIndicators
          height={132}
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
          slideGap="xs"
          loop
          align="start"
          slideSize="14%"
          breakpoints={[
            { maxWidth: "xl", slideSize: "16%" },
            { maxWidth: "lg", slideSize: "20%" },
            { maxWidth: "md", slideSize: "33%" },
            { maxWidth: "sm", slideSize: "50%" },
            { maxWidth: "xs", slideSize: "50%" },
          ]}
        >
          {cloudUrls.map((cloudUrl, index) => (
            <Carousel.Slide className="-z-50" key={index}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Image
                  onClick={() => openOverlay(cloudUrl)}
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
    </>
  );
};

export default ImagesSlider;
