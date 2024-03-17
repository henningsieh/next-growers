import { Box, Button, NativeSelect } from "@mantine/core";
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
  const router = useRouter();

  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const createdAtLabel = t("common:reports-createdAt");
  const updatedAtLabel = t("common:reports-updatedAt");

  return (
    <Box pt={3} m={0} className="inline-flex space-x-1">
      <Button
        className="cursor-default"
        c="dimmed"
        variant="filled"
        px={4}
        size="xs"
        onClick={handleToggleDesc}
      >
        {desc ? (
          <IconSortDescending2 size="1.2rem" />
        ) : (
          <IconSortAscending2 size="1.2rem" />
        )}
      </Button>
      <NativeSelect
        variant="filled"
        className="cursor-pointer"
        value={sortBy}
        onChange={(event) => setSortBy(event.currentTarget.value)}
        size="xs"
        fz="xs"
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
    </Box>
  );
}
