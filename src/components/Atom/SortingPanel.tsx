/* eslint-disable @typescript-eslint/no-unused-vars */

import { Box, Button, NativeSelect } from "@mantine/core";
import { IconCalendarEvent, IconChevronDown } from "@tabler/icons-react";
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
    <Box p={0} m={0} className="inline-flex space-x-4">
      <Button variant="default" size="xs" onClick={handleToggleDesc}>
        {desc ? <IconChevronDown size="1rem" /> : <IconChevronUp size="1rem" />}
      </Button>
      <NativeSelect
        variant="default"
        value={sortBy}
        onChange={(event) => setSortBy(event.currentTarget.value)}
        size="xs"
        placeholder="Pick a hashtag"
        data={[
          { value: "createdAt", label: "Created at" },
          { value: "updatedAt", label: "Updated at" },
        ]}
        icon={<IconCalendarEvent size="1rem" />}
      />
    </Box>
  );
}
