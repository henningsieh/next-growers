import { Box, Button, createStyles, NativeSelect } from "@mantine/core";
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
    select: {
      cursor: "pointer",

      // outlineWidth: "1px",
      // outlineStyle: "solid",
      // outlineColor: "dark"
      //   ? theme.colors.growgreen[4]
      //   : theme.colors.growgreen[8],
    },

    sortButton: {
      cursor: "pointer",
      marginTop: "1px",
      outlineWidth: "1px",
      outlineStyle: "solid",
      outlineColor: "dark"
        ? theme.colors.growgreen[4]
        : theme.colors.growgreen[8],
    },
  }));

  const { classes } = useStyles();

  return (
    <Box className="inline-flex space-x-1">
      <NativeSelect
        size="xs"
        value={sortBy}
        variant="default"
        className={classes.select}
        onChange={(event) => setSortBy(event.currentTarget.value)}
        data={[
          { value: "createdAt", label: createdAtLabel },
          { value: "updatedAt", label: updatedAtLabel },
        ]}
        icon={
          sortBy === "createdAt" ? (
            desc ? (
              <IconCalendarDown
                color="white"
                size="1.2rem"
                stroke={1.2}
              />
            ) : (
              <IconCalendarUp
                color="white"
                size="1.2rem"
                stroke={1.2}
              />
            )
          ) : desc ? (
            <IconClockDown color="white" size="1.2rem" stroke={1.2} />
          ) : (
            <IconClockUp color="white" size="1.2rem" stroke={1.2} />
          )
        }
      />
      <Button
        size="xs"
        className={classes.sortButton}
        variant="default"
        h={28}
        // w={24}
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
