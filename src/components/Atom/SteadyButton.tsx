import {
  Box,
  Button,
  createStyles,
  Group,
  keyframes,
  rem,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconHeartHandshake } from "@tabler/icons-react";
import { useSupporterModal } from "~/contexts/SupporterModalContext";

import React from "react";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

// Define keyframes for shine effect
const shine = keyframes({
  "0%": { backgroundPosition: "200% center" },
  "100%": { backgroundPosition: "-200% center" },
});

const pulse = keyframes({
  "0%": { transform: "scale(1)" },
  "50%": { transform: "scale(1.05)" },
  "100%": { transform: "scale(1)" },
});

const useStyles = createStyles((theme) => ({
  buttonWrapper: {
    margin: rem(1),
  },
  button: {
    position: "relative",
    overflow: "hidden",
    transition: "all 0.3s ease",
    background:
      theme.colorScheme === "dark"
        ? `linear-gradient(45deg, ${theme.colors.growgreen[9]}, ${theme.colors.growgreen[7]}, ${theme.colors.growgreen[5]})`
        : `linear-gradient(45deg, ${theme.colors.growgreen[4]}, ${theme.colors.growgreen[3]}, ${theme.colors.growgreen[2]})`,
    backgroundSize: "200% auto",
    animation: `${shine} 3s linear infinite, ${pulse} 2s ease-in-out infinite`,
    "&:hover": {
      backgroundSize: "200% auto",
      boxShadow:
        theme.colorScheme === "dark"
          ? `0 0 ${rem(15)} ${theme.colors.growgreen[5]}`
          : `0 0 ${rem(15)} ${theme.colors.growgreen[3]}`,
      transform: "scale(1.03)",
    },
  },
  buttonText: {
    fontSize: rem(theme.fontSizes.lg),
    fontWeight: 400,
    fontFamily: `'Roboto Slab', sans-serif`,
    color: theme.white,
    textShadow: "0 1px 2px rgba(255,255,255,0.3)",
  },
  icon: {
    animation: `${pulse} 20s ease-in-out infinite 0.5s`,
  },
}));

function SteadyButton() {
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);
  const { openModal } = useSupporterModal();

  const theme = useMantineTheme();
  const { classes } = useStyles();
  // Determine if we're on a small screen
  const isSmallScreen = useMediaQuery(
    `(max-width: ${theme.breakpoints.sm})`
  );
  const isMediumScreen = useMediaQuery(
    `(min-width: ${theme.breakpoints.sm}) and (max-width: ${theme.breakpoints.xl})`
  );

  // Choose the appropriate label based on screen size and locale
  const getButtonText = () => {
    let text;
    if (isSmallScreen) {
      text = ""; // No text on small screens
    } else if (isMediumScreen) {
      text = t("common:supporter-modal-title").split(" ")[0]; // Show just the first word on medium screens
    } else {
      text = t("common:supporter-modal-title"); // Show the full title on larger screens
    }

    return (
      <>
        <IconHeartHandshake
          color={theme.white}
          size={18}
          className={classes.icon}
        />
        {text && <Text className={classes.buttonText}>{text}</Text>}
      </>
    );
  };

  return (
    <Box className={classes.buttonWrapper}>
      <Button
        h={32}
        radius="sm"
        className={classes.button}
        title={t("common:app-steady-button-title")}
        onClick={openModal}
        px={isMediumScreen ? "xs" : "md"}
      >
        <Group spacing={isMediumScreen ? 6 : 8} position="center">
          {getButtonText()}
        </Group>
      </Button>
    </Box>
  );
}

export default SteadyButton;
