import {
  Box,
  Button,
  NativeSelect,
  rem,
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

  const theme = useMantineTheme();

  return (
    <Box className="inline-flex space-x-1">
      <NativeSelect
        w={174}
        h={28}
        mt={-1}
        size="xs"
        value={sortBy}
        onChange={(event) => setSortBy(event.target.value)}
        data={[
          { value: "createdAt", label: createdAtLabel },
          { value: "updatedAt", label: updatedAtLabel },
        ]}
        icon={
          sortBy === "createdAt" ? (
            desc ? (
              <IconCalendarDown
                color={
                  theme.colorScheme === "dark"
                    ? theme.white
                    : theme.colors.dark[4]
                }
                size={18}
                stroke={1.8}
              />
            ) : (
              <IconCalendarUp
                color={
                  theme.colorScheme === "dark"
                    ? theme.white
                    : theme.colors.dark[4]
                }
                size={18}
                stroke={1.8}
              />
            )
          ) : desc ? (
            <IconClockDown
              color={
                theme.colorScheme === "dark"
                  ? theme.white
                  : theme.colors.dark[4]
              }
              size={18}
              stroke={1.8}
            />
          ) : (
            <IconClockUp
              color={
                theme.colorScheme === "dark"
                  ? theme.white
                  : theme.colors.dark[4]
              }
              size={18}
              stroke={1.8}
            />
          )
        }
      />
      <Button
        h={28}
        size="xs"
        variant="filled"
        onClick={handleToggleDesc}
      >
        {desc ? (
          <IconSortDescending2 stroke={rem(1.8)} size={22} />
        ) : (
          <IconSortAscending2 stroke={rem(1.8)} size={22} />
        )}
      </Button>
    </Box>
  );
}
