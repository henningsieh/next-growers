import {
  ActionIcon,
  Box,
  Button,
  NativeSelect,
  createStyles,
  rem,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import {
  IconCalendarDown,
  IconCalendarUp,
  IconClockDown,
  IconClockUp,
  IconSortAscending2,
  IconSortDescending2,
} from "@tabler/icons-react";

import React from "react";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import type { SortingPanelProps } from "~/types";

export default function SortingPanel({
  sortBy,
  setSortBy,
  desc,
  handleToggleDesc,
}: SortingPanelProps) {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const theme = useMantineTheme();
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const createdAtLabel = t("common:reports-createdAt");
  const updatedAtLabel = t("common:reports-updatedAt");

  const useStyles = createStyles((theme) => ({
    cite: {
      borderLeft: `0px solid`, // no left border for this quote
      fontFamily: `'Roboto Slab', sans-serif`,
      fontSize: "1.2rem",
      color: theme.colors.gray[4],
      width: "100%",
    },

    overlay: {
      position: "absolute",
      top: "0%",
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage:
        "linear-gradient(180deg, rgba(0,0,0,0.8170868689272583) 20%, rgba(255,255,255,0) 70%, rgba(255,102,0,1) 100%)",
    },

    content: {
      width: "100%",
      height: "105%",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      zIndex: 12,
    },

    title: {
      color: theme.white,
      marginBottom: rem(1),
    },

    bodyText: {
      color: theme.colors.dark[4],
      marginRight: rem(7),
      fontWeight: "bold",
    },

    select: {
      backgroundColor: "blue",
      padding: "4px",
      // marginTop: "1px",
      // outlineWidth: "1px",
      // outlineStyle: "solid",
      // outlineColor: dark
      //   ? theme.colors.growgreen[4]
      //   : theme.colors.growgreen[8],
    },
  }));

  const { classes } = useStyles();

  return (
    <Box pt={3} m={0} className="inline-flex space-x-1">
      <NativeSelect
        variant="default"
        value={sortBy}
        className="cursor-pointer"
        onChange={(event) => setSortBy(event.currentTarget.value)}
        size="xs"
        data={[
          { value: "createdAt", label: createdAtLabel },
          { value: "updatedAt", label: updatedAtLabel },
        ]}
        icon={
          sortBy === "createdAt" ? (
            desc ? (
              <IconCalendarDown size="1.2rem" />
            ) : (
              <IconCalendarUp size="1.2rem" />
            )
          ) : desc ? (
            <IconClockDown size="1.2rem" />
          ) : (
            <IconClockUp size="1.2rem" />
          )
        }
      />
      <Button
        variant="outline"
        bg={"blue"}
        className={classes.select}
        h={30}
        onClick={handleToggleDesc}
      >
        {desc ? (
          <IconSortDescending2 size="1.4rem" />
        ) : (
          <IconSortAscending2 size="1.4rem" />
        )}
      </Button>
    </Box>
  );
}
