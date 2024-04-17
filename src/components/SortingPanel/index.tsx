import {
  Box,
  Button,
  NativeSelect,
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
      {/* {" "}
      <Select
        w={140}
        fz="lg"
        size="xs"
        variant="outline"
        value={sortBy}
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
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.growgreen[6]
                  : theme.colors.growgreen[1],
              color:
                theme.colorScheme === "dark"
                  ? theme.white
                  : theme.colors.growgreen[9],
            },

            // applies styles to hovered item (with mouse or keyboard)
            "&, &[data-hovered]": {
              // "&:hover": {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.growgreen[5]
                  : theme.colors.growgreen[3],
              color:
                theme.colorScheme === "dark"
                  ? theme.white
                  : theme.colors.growgreen[9],
              // },
            },
          },
        })}
        icon={
          sortBy === "createdAt" ? (
            desc ? (
              <IconCalendarDown
                color={
                  theme.colorScheme === "dark"
                    ? theme.colors.growgreen[3]
                    : theme.colors.growgreen[5]
                }
                size="1.2rem"
                stroke={1.8}
              />
            ) : (
              <IconCalendarUp
                color={
                  theme.colorScheme === "dark"
                    ? theme.colors.growgreen[3]
                    : theme.colors.growgreen[5]
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
      /> */}
      <NativeSelect
        w={150}
        h={28}
        mt={-1}
        size="xs"
        fz="lg"
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
                size="1.1rem"
                stroke={1.8}
              />
            ) : (
              <IconCalendarUp
                color={
                  theme.colorScheme === "dark"
                    ? theme.white
                    : theme.colors.dark[4]
                }
                size="1.1rem"
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
              size="1.1rem"
              stroke={1.8}
            />
          ) : (
            <IconClockUp
              color={
                theme.colorScheme === "dark"
                  ? theme.white
                  : theme.colors.dark[4]
              }
              size="1.1rem"
              stroke={1.8}
            />
          )
        }
      />
      <Button
        h={28}
        size="xs"
        variant="filled"
        color={theme.colorScheme === "dark" ? "dark" : "growgreen"}
        onClick={handleToggleDesc}
      >
        {desc ? (
          <IconSortDescending2 stroke={1.8} size="1.4rem" />
        ) : (
          <IconSortAscending2 stroke={1.8} size="1.4rem" />
        )}
      </Button>
    </Box>
  );
}
