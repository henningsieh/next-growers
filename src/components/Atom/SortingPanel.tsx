/* eslint-disable @typescript-eslint/no-unused-vars */

import { Box, Button, NativeSelect } from "@mantine/core";
import {
  IconCalendarDown,
  IconCalendarEvent,
  IconCalendarUp,
  IconChevronDown,
  IconClockDown,
  IconClockUp,
  IconSortAscending,
  IconSortAscending2,
  IconSortDescending,
  IconSortDescending2,
} from "@tabler/icons-react";
import React, { Dispatch, SetStateAction } from "react";

import { IconChevronUp } from "@tabler/icons-react";
import type { SortingPanelProps } from "~/types";

export default function SortingPanel({
  sortBy,
  setSortBy,
  desc,
  handleToggleDesc,
}: SortingPanelProps) {
  return (
    <Box pt={3} m={0} className="inline-flex space-x-1">
      <Button
        c="dimmed"
        variant="default"
        px={4}
        size="sm"
        onClick={handleToggleDesc}
      >
        {desc ? (
          <IconSortDescending2 size="1.2rem" />
        ) : (
          <IconSortAscending2 size="1.2rem" />
        )}
      </Button>
      <NativeSelect
        variant="default"
        value={sortBy}
        onChange={(event) => setSortBy(event.currentTarget.value)}
        size="sm"
        placeholder="Sort by..."
        data={[
          { value: "createdAt", label: "Created at" },
          { value: "updatedAt", label: "Updated at" },
        ]}
        icon={
          sortBy === "createdAt" ? (
            desc ? (
              <IconCalendarDown size="1.46rem" />
            ) : (
              <IconCalendarUp size="1.4rem" />
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
