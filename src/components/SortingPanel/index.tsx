import {
  Box,
  Button,
  createStyles,
  Select,
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

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import type { SortingPanelProps } from "~/types";

export default function SortingPanel({
  sortBy,
  setSortBy,
  desc,
  handleToggleDesc,
}: SortingPanelProps) {
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const createdAtLabel = t("common:reports-createdAt");
  const updatedAtLabel = t("common:reports-updatedAt");

  const useStyles = createStyles((theme) => ({
    sortButton: {
      marginTop: "1px",
      outlineWidth: "1px",
      outlineStyle: "solid",
      outlineColor:
        theme.colorScheme === "dark"
          ? theme.colors.growgreen[4]
          : theme.colors.growgreen[8],
      "&:focus": {
        // Define styles for the focused state
        outline: "none", // Remove default focus outline
        boxShadow: `0 0 0 1px ${theme.colorScheme === "dark" ? theme.colors.growgreen[4] : theme.colors.growgreen[8]}`, // Add custom box shadow to simulate focus outline
      },
      "&:active": {
        // Define styles for the focused state
        outline: "none", // Remove default focus outline
        boxShadow: `0 0 0 2px ${theme.colorScheme === "dark" ? theme.colors.growgreen[4] : theme.colors.growgreen[8]}`, // Add custom box shadow to simulate focus outline
      },
    },
  }));
  const { classes } = useStyles();

  const theme = useMantineTheme();
  return (
    <Box className="inline-flex space-x-1">
      <Select
        w={140}
        fz={"md"}
        size="xs"
        value={sortBy}
        className="text-lg"
        variant="default"
        onChange={(selectedValue) => setSortBy(selectedValue as string)}
        data={[
          { value: "createdAt", label: createdAtLabel },
          { value: "updatedAt", label: updatedAtLabel },
        ]}
        styles={(theme) => ({
          item: {
            paddingLeft: "8px",
            paddingTop: "0px",
            paddingBottom: "0px",
            marginTop: "1px",
            marginBottom: "0px",
            // applies styles to selected item
            "&[data-selected]": {
              "&": {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.growgreen[6]
                    : theme.colors.growgreen[1],
                color:
                  theme.colorScheme === "dark"
                    ? theme.white
                    : theme.colors.growgreen[9],
              },
            },

            // applies styles to hovered item (with mouse or keyboard)
            "&, &[data-hovered]": {
              "&:hover": {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.growgreen[5]
                    : theme.colors.growgreen[3],
                color:
                  theme.colorScheme === "dark"
                    ? theme.white
                    : theme.colors.growgreen[9],
              },
            },
          },
        })}
        icon={
          sortBy === "createdAt" ? (
            desc ? (
              <IconCalendarDown
                color={
                  theme.colorScheme === "dark"
                    ? theme.white
                    : theme.black
                }
                size="1.2rem"
                stroke={1.8}
              />
            ) : (
              <IconCalendarUp
                color={
                  theme.colorScheme === "dark"
                    ? theme.white
                    : theme.black
                }
                size="1.2rem"
                stroke={1.8}
              />
            )
          ) : desc ? (
            <IconClockDown
              color={
                theme.colorScheme === "dark"
                  ? theme.colors.growgreen[3]
                  : theme.colors.growgreen[5]
              }
              size="1.2rem"
              stroke={1.8}
            />
          ) : (
            <IconClockUp
              color={
                theme.colorScheme === "dark"
                  ? theme.colors.growgreen[3]
                  : theme.colors.growgreen[5]
              }
              size="1.2rem"
              stroke={1.8}
            />
          )
        }
      />
      <Button
        h={28}
        size="xs"
        variant="default"
        className={classes.sortButton}
        onClick={handleToggleDesc}
      >
        {desc ? (
          <IconSortDescending2 stroke={1.4} size="1.4rem" />
        ) : (
          <IconSortAscending2 stroke={1.4} size="1.4rem" />
        )}
      </Button>
    </Box>
  );
}
